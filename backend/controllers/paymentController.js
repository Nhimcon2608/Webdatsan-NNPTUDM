import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

export async function getPayments(req, res) {
  const { branchId, reservationId, orderId } = req.query;
  let rows = await list("payments");

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

export function createPaymentLink(req, res) {
  const paymentRequest = req.body || {};
  const orderId = paymentRequest.orderId || `MOMO-${Date.now()}`;

  const payUrl = `https://test-payment.momo.vn/pay/${orderId}`;
  return created(
    res,
    {
      orderId,
      payUrl,
      request: paymentRequest,
    },
    "Payment link created",
  );
}
