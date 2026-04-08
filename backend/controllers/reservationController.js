// Controller chính cho reservation và flow đặt sân.
import { randomUUID } from "crypto";

import { created, ok } from "../utils/response.js";
import { getRequestAccount } from "../middleware/auth.js";
import { getCollection } from "../utils/database.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import {
  buildReservationDetailsMap,
  isCancelledStatus,
  normalizeReservationStatus,
  serializeReservation,
} from "../utils/reservationView.js";
import {
  buildReservationDetailDocuments,
  buildReservationSlotLocks,
  claimReservationSlotLocks,
  findConflictingReservationSlot,
  normalizeReservationDetails,
  releaseReservationSlotLocks,
} from "../utils/reservationSlots.js";

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

// Reservation context được tải một lần để mỗi booking có thể serialize kèm player và detail.
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

function isDuplicateKeyError(error) {
  return Number(error?.code) === 11000;
}

async function cleanupIncompleteReservation(reservationId) {
  const normalizedReservationId = String(reservationId || "").trim();
  if (!normalizedReservationId) {
    return;
  }

  await Promise.all([
    getCollection("reservations").deleteOne({ id: normalizedReservationId }),
    getCollection("reservationDetails").deleteMany({ reservationId: normalizedReservationId }),
    releaseReservationSlotLocks(normalizedReservationId),
  ]);
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

  if (status && normalizeReservationStatus(status) !== "all") {
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
  const reservationId = randomUUID();
  const bookDate = String(payload.bookDate || payload.bookAt || new Date().toISOString()).slice(0, 10);
  const reservationDetailsInput = Array.isArray(payload.reservationDetails) ? payload.reservationDetails : [];

  if (!reservationDetailsInput.length) {
    const createdRow = await insert("reservations", {
      ...payload,
      id: reservationId,
      userAccountId: payload.userAccountId || req.context.accountId,
      status: payload.status || "BOOKED",
      bookDate,
    });

    const context = await loadReservationContext();
    return created(res, serializeReservation(createdRow, context), "Reservation created");
  }

  let normalizedDetails;
  try {
    normalizedDetails = normalizeReservationDetails(reservationDetailsInput, bookDate);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  const slotLocks = buildReservationSlotLocks(reservationId, normalizedDetails);

  try {
    // Claim slot trước để chặn double booking đồng thời.
    await claimReservationSlotLocks(slotLocks);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const conflict = await findConflictingReservationSlot(slotLocks);
      const conflictMessage = conflict
        ? `Court ${conflict.courtId} is already booked on ${conflict.slotDate} at ${conflict.slotStart}`
        : "Selected court slot is already booked";

      return res.status(409).json({
        success: false,
        message: conflictMessage,
      });
    }

    throw error;
  }

  try {
    const createdRow = await insert("reservations", {
      ...payload,
      id: reservationId,
      courtId: payload.courtId || normalizedDetails[0]?.courtId || "",
      userAccountId: payload.userAccountId || req.context.accountId,
      status: payload.status || "BOOKED",
      bookDate,
    });

    await getCollection("reservationDetails").insertMany(
      buildReservationDetailDocuments(reservationId, normalizedDetails),
      { ordered: true },
    );

    const context = await loadReservationContext();
    return created(res, serializeReservation(createdRow, context), "Reservation created");
  } catch (error) {
    await cleanupIncompleteReservation(reservationId);
    throw error;
  }
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

  if (isCancelledStatus(updated.status)) {
    await releaseReservationSlotLocks(updated.id);
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

  await releaseReservationSlotLocks(
    updatedRows.filter((row) => isCancelledStatus(row.status)).map((row) => row.id),
  );

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
