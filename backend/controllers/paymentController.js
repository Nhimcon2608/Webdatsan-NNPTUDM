// Xử lý payment nội bộ, payment link MoMo và IPN callback.
import { createHmac } from "crypto";

import { created, ok } from "../utils/response.js";
import { getRequestAccount } from "../middleware/auth.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import { releaseReservationSlotLocks } from "../utils/reservationSlots.js";

const MOMO_SUCCESS_CODE = 0;
const MOMO_AUTHORIZED_CODE = 9000;

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount) : NaN;
}

function getMomoConfig() {
  return {
    partnerCode: String(process.env.MOMO_PARTNER_CODE || "").trim(),
    accessKey: String(process.env.MOMO_ACCESS_KEY || "").trim(),
    secretKey: String(process.env.MOMO_SECRET_KEY || "").trim(),
    redirectUrl: String(process.env.MOMO_REDIRECT_URL || "").trim(),
    ipnUrl: String(process.env.MOMO_IPN_URL || "").trim(),
    endpoint: String(process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create").trim(),
  };
}

function isMomoConfigured(config = getMomoConfig()) {
  return Boolean(
    config.partnerCode &&
      config.accessKey &&
      config.secretKey &&
      config.redirectUrl &&
      config.ipnUrl &&
      config.endpoint,
  );
}

function signMomoMessage(rawSignature, secretKey) {
  return createHmac("sha256", secretKey).update(rawSignature).digest("hex");
}

function buildMomoCreateSignature(payload, accessKey, secretKey) {
  const rawSignature =
    `accessKey=${accessKey}&amount=${payload.amount}&extraData=${payload.extraData}` +
    `&ipnUrl=${payload.ipnUrl}&orderId=${payload.orderId}&orderInfo=${payload.orderInfo}` +
    `&partnerCode=${payload.partnerCode}&redirectUrl=${payload.redirectUrl}` +
    `&requestId=${payload.requestId}&requestType=${payload.requestType}`;

  return signMomoMessage(rawSignature, secretKey);
}

function buildMomoResultSignature(payload, accessKey, secretKey) {
  const rawSignature =
    `accessKey=${accessKey}&amount=${payload.amount}&extraData=${payload.extraData || ""}` +
    `&message=${payload.message || ""}&orderId=${payload.orderId || ""}` +
    `&orderInfo=${payload.orderInfo || ""}&orderType=${payload.orderType || ""}` +
    `&partnerCode=${payload.partnerCode || ""}&payType=${payload.payType || ""}` +
    `&requestId=${payload.requestId || ""}&responseTime=${payload.responseTime || ""}` +
    `&resultCode=${payload.resultCode ?? ""}&transId=${payload.transId ?? ""}`;

  return signMomoMessage(rawSignature, secretKey);
}

function encodeMomoExtraData(data) {
  return Buffer.from(JSON.stringify(data || {}), "utf8").toString("base64");
}

function decodeMomoExtraData(extraData) {
  if (!extraData) {
    return {};
  }

  try {
    return JSON.parse(Buffer.from(String(extraData), "base64").toString("utf8"));
  } catch {
    return {};
  }
}

function extractReservationIdsFromPayment(payment) {
  return [
    ...toArray(payment?.reservationIds).map((id) => String(id)),
    ...(payment?.reservationId ? [String(payment.reservationId)] : []),
  ].filter(Boolean);
}

function mapMomoResultToPaymentStatus(resultCode) {
  const numericCode = Number(resultCode);

  if (numericCode === MOMO_SUCCESS_CODE) {
    return "PAID";
  }

  if (numericCode === MOMO_AUTHORIZED_CODE) {
    return "AUTHORIZED";
  }

  return "FAILED";
}

function mapMomoResultToReservationStatus(resultCode) {
  const numericCode = Number(resultCode);

  if (numericCode === MOMO_SUCCESS_CODE) {
    return "WAITING";
  }

  if (numericCode === MOMO_AUTHORIZED_CODE) {
    return "AWAITING_PAYMENT";
  }

  return "CANCEL";
}

async function findPaymentsByOrderId(orderId) {
  const rows = await list("payments");
  return rows.filter((item) => String(item.orderId || "") === String(orderId || ""));
}

async function syncPaymentAndReservations(paymentRows, momoPayload) {
  const paymentStatus = mapMomoResultToPaymentStatus(momoPayload.resultCode);
  const reservationStatus = mapMomoResultToReservationStatus(momoPayload.resultCode);
  const paidAt =
    Number(momoPayload.resultCode) === MOMO_SUCCESS_CODE ? new Date().toISOString() : null;

  const reservationIds = [
    ...new Set(
      paymentRows.flatMap((row) => extractReservationIdsFromPayment(row)),
    ),
  ];

  await Promise.all(
    paymentRows.map((row) =>
      updateById("payments", row.id, {
        paymentStatus,
        provider: "MOMO",
        providerMessage: momoPayload.message || "",
        providerResultCode: Number(momoPayload.resultCode),
        providerTransactionId:
          momoPayload.transId !== undefined && momoPayload.transId !== null
            ? String(momoPayload.transId)
            : "",
        payType: momoPayload.payType || "",
        responseTime:
          momoPayload.responseTime !== undefined && momoPayload.responseTime !== null
            ? Number(momoPayload.responseTime)
            : null,
        paidAt,
        extraData: momoPayload.extraData || "",
      }),
    ),
  );

  await Promise.all(
    reservationIds.map((reservationId) =>
      updateById("reservations", reservationId, { status: reservationStatus }),
    ),
  );

  if (reservationStatus === "CANCEL") {
    await releaseReservationSlotLocks(reservationIds);
  }
}

export async function getPayments(req, res) {
  const { branchId, reservationId, orderId } = req.query;
  let rows = await list("payments");

  if (!orderId) {
    const account = await getRequestAccount(req);
    const role = req.context?.role;

    if (!account) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!["ADMIN", "MANAGER"].includes(role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
  }

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (reservationId) {
    rows = rows.filter((item) => item.reservationId === reservationId);
  }

  if (orderId) {
    rows = rows.filter((item) => item.orderId === orderId);
  }

  return ok(res, rows);
}

export async function createPayment(req, res) {
  const { reservationId } = req.body || {};
  if (!reservationId) {
    return res.status(400).json({ success: false, message: "reservationId is required" });
  }

  const reservation = await findById("reservations", reservationId);
  if (!reservation) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  const createdPayment = await insert("payments", {
    reservationId,
    branchId: reservation.branchId,
    paymentStatus: "PENDING",
    amount: req.body?.amount || 0,
    orderId: `ORDER-${Date.now()}`,
  });

  return created(res, createdPayment, "Invoice created");
}

export async function updatePayment(req, res) {
  const { paymentId } = req.params;
  const status = req.body?.paymentStatus || req.body?.status;

  if (!status) {
    return res.status(400).json({ success: false, message: "paymentStatus is required" });
  }

  const updated = await updateById("payments", paymentId, {
    paymentStatus: String(status).toUpperCase(),
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  return ok(res, updated, "Payment status updated");
}

export async function createPaymentLink(req, res) {
  // Chỉ tạo payment link khi mọi reservation thuộc user hiện tại và cùng branch.
  const config = getMomoConfig();
  if (!isMomoConfigured(config)) {
    return res.status(500).json({
      success: false,
      message: "MoMo is not configured",
    });
  }

  const account = await getRequestAccount(req);
  if (!account) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const paymentRequest = req.body || {};
  const reservationIds = [...new Set(toArray(paymentRequest.resIds).map((id) => String(id)).filter(Boolean))];
  const amount = normalizeAmount(paymentRequest.amount);

  if (!reservationIds.length) {
    return res.status(400).json({ success: false, message: "resIds is required" });
  }

  if (!Number.isFinite(amount) || amount < 1000) {
    return res.status(400).json({ success: false, message: "amount must be at least 1000 VND" });
  }

  const reservations = await Promise.all(
    reservationIds.map((reservationId) => findById("reservations", reservationId)),
  );

  if (reservations.some((reservation) => !reservation)) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  if (reservations.some((reservation) => reservation.userAccountId !== req.context.accountId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const branchIds = [...new Set(reservations.map((reservation) => reservation.branchId).filter(Boolean))];
  if (branchIds.length > 1) {
    return res.status(400).json({
      success: false,
      message: "MoMo payment only supports reservations from the same branch",
    });
  }

  const orderId = paymentRequest.orderId || `MOMO-${Date.now()}`;
  const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const extraData = encodeMomoExtraData({
    reservationIds,
    userAccountId: req.context.accountId,
  });

  const momoPayload = {
    partnerCode: config.partnerCode,
    amount,
    orderId,
    orderInfo: String(
      paymentRequest.orderInfo || `Thanh toan don hang ${orderId}`,
    ).slice(0, 255),
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    requestId,
    requestType: "captureWallet",
    extraData,
    lang: "vi",
    autoCapture: true,
  };

  // Payload gửi sang provider sẽ được ký trước khi gọi MoMo.
  momoPayload.signature = buildMomoCreateSignature(
    momoPayload,
    config.accessKey,
    config.secretKey,
  );

  let momoResponse;
  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(momoPayload),
      signal: AbortSignal.timeout(30000),
    });

    momoResponse = await response.json();
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: `Unable to connect to MoMo: ${error.message}`,
    });
  }

  if (Number(momoResponse?.resultCode) !== MOMO_SUCCESS_CODE || !momoResponse?.payUrl) {
    return res.status(502).json({
      success: false,
      message: momoResponse?.message || "MoMo did not return a payment URL",
      data: momoResponse,
    });
  }

  const createdPayment = await insert("payments", {
    reservationId: reservationIds[0],
    reservationIds,
    branchId: branchIds[0] || "",
    userAccountId: req.context.accountId,
    paymentStatus: "PENDING",
    amount,
    orderId,
    requestId,
    provider: "MOMO",
    orderInfo: momoPayload.orderInfo,
    payUrl: momoResponse.payUrl,
    extraData,
  });

  return created(
    res,
    {
      id: createdPayment.id,
      orderId,
      requestId,
      payUrl: momoResponse.payUrl,
      deeplink: momoResponse.deeplink || "",
      qrCodeUrl: momoResponse.qrCodeUrl || "",
      reservationIds,
    },
    "Payment link created",
  );
}

export async function handleMomoIpn(req, res) {
  // Chỉ cập nhật trạng thái nội bộ khi chữ ký IPN hợp lệ.
  const config = getMomoConfig();
  const payload = req.body || {};

  if (!isMomoConfigured(config)) {
    return res.status(204).end();
  }

  const expectedSignature = buildMomoResultSignature(payload, config.accessKey, config.secretKey);
  if (String(payload.signature || "") !== expectedSignature) {
    console.error("Invalid MoMo IPN signature", {
      orderId: payload.orderId,
      requestId: payload.requestId,
    });
    return res.status(204).end();
  }

  const paymentRows = await findPaymentsByOrderId(payload.orderId);
  if (!paymentRows.length) {
    const extraData = decodeMomoExtraData(payload.extraData);
    console.error("MoMo IPN order not found", {
      orderId: payload.orderId,
      reservationIds: extraData.reservationIds || [],
    });
    return res.status(204).end();
  }

  const storedAmount = Number(paymentRows[0]?.amount || 0);
  if (storedAmount && storedAmount !== Number(payload.amount || 0)) {
    console.error("MoMo IPN amount mismatch", {
      orderId: payload.orderId,
      expectedAmount: storedAmount,
      receivedAmount: Number(payload.amount || 0),
    });
    return res.status(204).end();
  }

  await syncPaymentAndReservations(paymentRows, payload);
  return res.status(204).end();
}
