import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import {
  buildReservationDetailsMap,
  isCancelledStatus,
  normalizeReservationStatus,
  serializeReservation,
} from "../utils/reservationView.js";

function toDateOnly(value) {
  return String(value || "").slice(0, 10);
}

async function loadReservationContext() {
  const [accounts, players, reservationDetails] = await Promise.all([
    list("accounts"),
    list("players"),
    list("reservationDetails"),
  ]);

  return {
    accounts,
    players,
    detailsByReservationId: buildReservationDetailsMap(reservationDetails),
  };
}

async function serializeReservations(rows) {
  const context = await loadReservationContext();
  return rows.map((row) => serializeReservation(row, context));
}

export async function getAllReservations(_req, res) {
  return ok(res, await serializeReservations(await list("reservations")));
}

export async function getReservationsByBranchAndDate(req, res) {
  const { branchId, date } = req.params;
  const rows = (await list("reservations")).filter(
    (item) =>
      item.branchId === branchId &&
      toDateOnly(item.bookDate || item.bookAt) === toDateOnly(date) &&
      !isCancelledStatus(item.status),
  );
  return ok(res, await serializeReservations(rows));
}

export async function getReservationsByBranch(req, res) {
  const { branchId } = req.params;
  const { from, to } = req.query;

  let rows = (await list("reservations")).filter((item) => item.branchId === branchId);

  if (from && to) {
    const fromDate = toDateOnly(from);
    const toDate = toDateOnly(to);
    rows = rows.filter((item) => {
      const bookDate = toDateOnly(item.bookDate || item.bookAt);
      return bookDate >= fromDate && bookDate <= toDate;
    });
  }

  rows = rows.filter((item) => !isCancelledStatus(item.status));
  return ok(res, await serializeReservations(rows));
}

export async function getAllReservationsByBranch(req, res) {
  const { branchId } = req.params;
  const rows = (await list("reservations")).filter((item) => item.branchId === branchId);
  return ok(res, await serializeReservations(rows));
}

export async function getReservationById(req, res) {
  const row = await findById("reservations", req.params.reservationId);
  if (!row) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  const context = await loadReservationContext();
  return ok(res, serializeReservation(row, context));
}

export async function getReservationsByUserStatus(req, res) {
  const { status } = req.params;
  const accountId = req.context.accountId;

  const rows = (await list("reservations")).filter(
    (item) =>
      item.userAccountId === accountId &&
      normalizeReservationStatus(item.status) === normalizeReservationStatus(status),
  );

  return ok(res, await serializeReservations(rows));
}

export async function createReservation(req, res) {
  const payload = req.body || {};
  const createdRow = await insert("reservations", {
    ...payload,
    userAccountId: payload.userAccountId || req.context.accountId,
    status: payload.status || "BOOKED",
    bookDate: payload.bookDate || new Date().toISOString().slice(0, 10),
  });

  const context = await loadReservationContext();
  return created(res, serializeReservation(createdRow, context), "Reservation created");
}

export async function cancelReservation(req, res) {
  const { reservationId } = req.params;
  const updated = await updateById("reservations", reservationId, { status: "CANCELLED" });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  const context = await loadReservationContext();
  return ok(res, serializeReservation(updated, context), "Reservation cancelled");
}

export async function updateReservation(req, res) {
  const { reservationId } = req.params;
  const updated = await updateById("reservations", reservationId, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  const context = await loadReservationContext();
  return ok(res, serializeReservation(updated, context), "Reservation updated");
}

export async function scheduleCancellationById(req, res) {
  const { reservationId } = req.params;
  const updated = await updateById("reservations", reservationId, { status: "SCHEDULED_CANCEL" });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  const context = await loadReservationContext();
  return ok(res, serializeReservation(updated, context), "Reservation scheduled for cancellation");
}

export async function scheduleCancellationBulk(req, res) {
  const input = req.body;
  const reservationIds = Array.isArray(input)
    ? input
    : Array.isArray(input?.reservationIds)
      ? input.reservationIds
      : [];

  const updatedRows = (
    await Promise.all(
      reservationIds.map((id) =>
        updateById("reservations", String(id), { status: "SCHEDULED_CANCEL" }),
      ),
    )
  ).filter(Boolean);

  return ok(res, await serializeReservations(updatedRows), "Bulk cancellation scheduled");
}

export async function getLatestReservations(req, res) {
  const { branchId } = req.query;

  let rows = [...(await list("reservations"))];
  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ok(res, await serializeReservations(rows));
}

export async function updateReservationStatus(req, res) {
  const { reservationId } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  const updated = await updateById("reservations", reservationId, {
    status: String(status).toUpperCase(),
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  const context = await loadReservationContext();
  return ok(res, serializeReservation(updated, context), "Reservation status updated");
}

export async function sendReservationNotification(req, res) {
  const { reservationId } = req.params;
  const row = await findById("reservations", reservationId);
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
