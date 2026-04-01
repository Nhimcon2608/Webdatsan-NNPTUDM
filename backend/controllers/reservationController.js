import { created, ok } from "../utils/response.js";
import { getRequestAccount } from "../middleware/auth.js";
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

function sortReservations(rows, sort) {
  if (sort === "-createdAt") {
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (sort === "createdAt") {
    rows.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
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

export async function getReservations(req, res) {
  const {
    branchId,
    date,
    from,
    to,
    status,
    userScope,
    excludeCancelled,
    sort,
  } = req.query;

  let rows = [...(await list("reservations"))];

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (userScope === "current") {
    const account = await getRequestAccount(req);

    if (!account) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    rows = rows.filter((item) => item.userAccountId === req.context.accountId);
  }

  if (status) {
    rows = rows.filter(
      (item) =>
        normalizeReservationStatus(item.status) === normalizeReservationStatus(status),
    );
  }

  if (date) {
    rows = rows.filter(
      (item) => toDateOnly(item.bookDate || item.bookAt) === toDateOnly(date),
    );
  }

  if (from && to) {
    const fromDate = toDateOnly(from);
    const toDate = toDateOnly(to);
    rows = rows.filter((item) => {
      const bookDate = toDateOnly(item.bookDate || item.bookAt);
      return bookDate >= fromDate && bookDate <= toDate;
    });
  }

  if (excludeCancelled === "true") {
    rows = rows.filter((item) => !isCancelledStatus(item.status));
  }

  sortReservations(rows, sort);
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

export async function updateReservation(req, res) {
  const { reservationId } = req.params;
  const payload = { ...(req.body || {}) };
  if (payload.status) {
    payload.status = String(payload.status).toUpperCase();
  }

  const updated = await updateById("reservations", reservationId, payload);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }
  const context = await loadReservationContext();
  return ok(res, serializeReservation(updated, context), "Reservation updated");
}

export async function bulkUpdateReservations(req, res) {
  const reservationIds = Array.isArray(req.body?.reservationIds) ? req.body.reservationIds : [];
  const status = req.body?.status;

  if (!reservationIds.length) {
    return res.status(400).json({ success: false, message: "reservationIds is required" });
  }

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  const updatedRows = (
    await Promise.all(
      reservationIds.map((id) =>
        updateById("reservations", String(id), { status: String(status).toUpperCase() }),
      ),
    )
  ).filter(Boolean);

  return ok(res, await serializeReservations(updatedRows), "Reservations updated");
}

export async function createReservationNotification(req, res) {
  const { reservationId } = req.params;
  const row = await findById("reservations", reservationId);
  if (!row) {
    return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  return created(
    res,
    {
      id: `reservation-notification-${Date.now()}`,
      reservationId,
      createdAt: new Date().toISOString(),
      target: req.body?.target || "manager",
    },
    "Reservation notification queued",
  );
}
