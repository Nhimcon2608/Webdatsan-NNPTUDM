import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

export function createPayment(req, res) {
  const { reservationId } = req.body || {};
  if (!reservationId) {
    return res.status(400).json({ success: false, message: "reservationId is required" });
  }

  const reservation = findById("reservations", reservationId);
  if (!reservation) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  const createdPayment = insert("payments", {
    reservationId,
    branchId: reservation.branchId,
    paymentStatus: "PENDING",
    amount: req.body?.amount || 0,
    orderId: `ORDER-${Date.now()}`,
  });

  return created(res, createdPayment, "Invoice created");
}

export function getPaymentsByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("payments").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function updatePaymentStatus(req, res) {
  const { invoiceId } = req.params;
  const status = req.body?.paymentStatus;

  if (!status) {
    return res.status(400).json({ success: false, message: "paymentStatus is required" });
  }

  const updated = updateById("payments", invoiceId, { paymentStatus: String(status).toUpperCase() });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  return ok(res, updated, "Payment status updated");
}

export function createMomoPayment(req, res) {
  const paymentRequest = req.body || {};
  const orderId = paymentRequest.orderId || `MOMO-${Date.now()}`;

  const payUrl = `https://test-payment.momo.vn/pay/${orderId}`;
  return ok(
    res,
    {
      orderId,
      payUrl,
      request: paymentRequest,
    },
    "MoMo payment URL generated",
  );
}

export function getReservationIdsByOrderId(req, res) {
  const { orderId } = req.params;

  const rows = list("payments").filter((item) => item.orderId === orderId);
  const reservationIds = rows.map((item) => item.reservationId);

  return ok(res, reservationIds);
}
