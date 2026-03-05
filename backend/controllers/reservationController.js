import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toDateOnly(value) {
  return String(value || "").slice(0, 10);
}

export function getAllReservations(_req, res) {
  return ok(res, list("reservations"));
}

export function getReservationsByBranchAndDate(req, res) {
  const { branchId, date } = req.params;
  const rows = list("reservations").filter(
    (item) =>
      item.branchId === branchId &&
      toDateOnly(item.bookDate) === toDateOnly(date) &&
      item.status !== "CANCELLED",
  );
  return ok(res, rows);
}

export function getReservationsByBranch(req, res) {
  const { branchId } = req.params;
  const { from, to } = req.query;

  let rows = list("reservations").filter((item) => item.branchId === branchId);

  if (from && to) {
    const fromDate = toDateOnly(from);
    const toDate = toDateOnly(to);
    rows = rows.filter((item) => {
      const bookDate = toDateOnly(item.bookDate);
      return bookDate >= fromDate && bookDate <= toDate;
    });
  }

  rows = rows.filter((item) => item.status !== "CANCELLED");
  return ok(res, rows);
}

export function getAllReservationsByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("reservations").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function getReservationById(req, res) {
  const row = findById("reservations", req.params.reservationId);
  if (!row) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  return ok(res, row);
}

export function getReservationsByUserStatus(req, res) {
  const { status } = req.params;
  const accountId = req.context.accountId;

  const rows = list("reservations").filter(
    (item) => item.userAccountId === accountId && item.status.toLowerCase() === status.toLowerCase(),
  );

  return ok(res, rows);
}

export function createReservation(req, res) {
  const payload = req.body || {};
  const createdRow = insert("reservations", {
    ...payload,
    userAccountId: payload.userAccountId || req.context.accountId,
    status: payload.status || "BOOKED",
    bookDate: payload.bookDate || new Date().toISOString().slice(0, 10),
  });

  return created(res, createdRow, "Reservation created");
}

export function cancelReservation(req, res) {
  const { reservationId } = req.params;
  const updated = updateById("reservations", reservationId, { status: "CANCELLED" });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  return ok(res, updated, "Reservation cancelled");
}

export function updateReservation(req, res) {
  const { reservationId } = req.params;
  const updated = updateById("reservations", reservationId, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  return ok(res, updated, "Reservation updated");
}

export function scheduleCancellationById(req, res) {
  const { reservationId } = req.params;
  const updated = updateById("reservations", reservationId, { status: "SCHEDULED_CANCEL" });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  return ok(res, updated, "Reservation scheduled for cancellation");
}

export function scheduleCancellationBulk(req, res) {
  const input = req.body;
  const reservationIds = Array.isArray(input)
    ? input
    : Array.isArray(input?.reservationIds)
      ? input.reservationIds
      : [];

  const updatedRows = reservationIds
    .map((id) => updateById("reservations", String(id), { status: "SCHEDULED_CANCEL" }))
    .filter(Boolean);

  return ok(res, updatedRows, "Bulk cancellation scheduled");
}

export function getLatestReservations(req, res) {
  const { branchId } = req.query;

  let rows = [...list("reservations")];
  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ok(res, rows);
}

export function updateReservationStatus(req, res) {
  const { reservationId } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  const updated = updateById("reservations", reservationId, { status: String(status).toUpperCase() });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  return ok(res, updated, "Reservation status updated");
}

export function sendReservationNotification(req, res) {
  const { reservationId } = req.params;
  const row = findById("reservations", reservationId);
  if (!row) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  return ok(
    res,
    {
      reservationId,
      notifiedAt: new Date().toISOString(),
      target: "manager",
    },
    "Notification queued",
  );
}
