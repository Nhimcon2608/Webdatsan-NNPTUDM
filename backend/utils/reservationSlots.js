import { randomUUID } from "crypto";

import { getCollection } from "./database.js";
import { isCancelledStatus } from "./reservationView.js";

export const RESERVATION_SLOT_LOCKS_RESOURCE = "reservationSlotLocks";
const BOOKING_SLOT_MINUTES = 60;

function nowIso() {
  return new Date().toISOString();
}

function toDateOnly(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  return normalized.slice(0, 10);
}

function toHourNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return 0;
    }

    if (trimmed.includes(":")) {
      const [hours = "0", minutes = "0"] = trimmed.split(":");
      const parsedHours = Number(hours);
      const parsedMinutes = Number(minutes);
      if (Number.isFinite(parsedHours) && Number.isFinite(parsedMinutes)) {
        return parsedHours + parsedMinutes / 60;
      }
    }

    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function toTimeString(value) {
  if (typeof value === "string" && value.includes(":")) {
    const [hours = "00", minutes = "00"] = value.split(":");
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const hourValue = toHourNumber(value);
  const hours = Math.floor(hourValue);
  const minutes = Math.round((hourValue - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toMinutes(value) {
  const [hours = "0", minutes = "0"] = toTimeString(value).split(":");
  return Number(hours) * 60 + Number(minutes);
}

function addMinutes(value, minutesToAdd) {
  const totalMinutes = toMinutes(value) + Number(minutesToAdd || 0);
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toPositiveHours(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function ensureSlotStep(totalMinutes, fieldName) {
  if (totalMinutes <= 0 || totalMinutes % BOOKING_SLOT_MINUTES !== 0) {
    throw new Error(`${fieldName} must align to ${BOOKING_SLOT_MINUTES}-minute slots`);
  }
}

export function normalizeReservationDetails(inputDetails, fallbackBookDate) {
  if (!Array.isArray(inputDetails) || !inputDetails.length) {
    return [];
  }

  return inputDetails.map((detail, index) => {
    const courtId = String(detail?.badmintonCourtId || detail?.courtId || "").trim();
    if (!courtId) {
      throw new Error(`reservationDetails[${index}].courtId is required`);
    }

    const slotDate = toDateOnly(detail?.slotDate || fallbackBookDate);
    if (!slotDate) {
      throw new Error(`reservationDetails[${index}].slotDate is required`);
    }

    const startTimeSource = detail?.startTime || detail?.slotStart;
    if (!startTimeSource) {
      throw new Error(`reservationDetails[${index}].startTime is required`);
    }

    const startTime = toTimeString(startTimeSource);
    const endTimeSource = detail?.endTime || detail?.slotEnd;
    const rentalTime = toPositiveHours(detail?.rentalTime);
    const extendedTime = toPositiveHours(detail?.extendedTime);

    let totalMinutes = 0;
    let endTime = "";

    if (endTimeSource) {
      endTime = toTimeString(endTimeSource);
      totalMinutes = toMinutes(endTime) - toMinutes(startTime);
      ensureSlotStep(totalMinutes, `reservationDetails[${index}].endTime`);
    } else {
      totalMinutes = Math.round((rentalTime + extendedTime) * 60);
      ensureSlotStep(totalMinutes, `reservationDetails[${index}].rentalTime`);
      endTime = addMinutes(startTime, totalMinutes);
    }

    const normalizedRentalTime =
      rentalTime > 0 ? rentalTime : Math.max(totalMinutes / 60 - extendedTime, 0);

    return {
      courtId,
      badmintonCourtId: courtId,
      slotDate,
      startTime,
      endTime,
      rentalTime: normalizedRentalTime,
      extendedTime,
    };
  });
}

export function buildReservationDetailDocuments(reservationId, normalizedDetails) {
  const createdAt = nowIso();

  return normalizedDetails.map((detail) => ({
    id: randomUUID(),
    reservationId,
    courtId: detail.courtId,
    badmintonCourtId: detail.courtId,
    slotDate: detail.slotDate,
    startTime: detail.startTime,
    endTime: detail.endTime,
    slotStart: detail.startTime,
    slotEnd: detail.endTime,
    rentalTime: detail.rentalTime,
    extendedTime: detail.extendedTime,
    createdAt,
  }));
}

export function buildReservationSlotLocks(reservationId, normalizedDetails) {
  const createdAt = nowIso();
  const slotLocks = [];
  const dedupeKeys = new Set();

  for (const detail of normalizedDetails) {
    for (
      let slotStartMinutes = toMinutes(detail.startTime);
      slotStartMinutes < toMinutes(detail.endTime);
      slotStartMinutes += BOOKING_SLOT_MINUTES
    ) {
      const slotStart = addMinutes("00:00", slotStartMinutes);
      const slotEnd = addMinutes(slotStart, BOOKING_SLOT_MINUTES);
      const dedupeKey = `${detail.courtId}|${detail.slotDate}|${slotStart}`;

      if (dedupeKeys.has(dedupeKey)) {
        continue;
      }

      dedupeKeys.add(dedupeKey);
      slotLocks.push({
        id: randomUUID(),
        reservationId,
        courtId: detail.courtId,
        slotDate: detail.slotDate,
        slotStart,
        slotEnd,
        createdAt,
      });
    }
  }

  return slotLocks;
}

export async function claimReservationSlotLocks(slotLocks) {
  if (!slotLocks.length) {
    return;
  }

  await getCollection(RESERVATION_SLOT_LOCKS_RESOURCE).insertMany(slotLocks, { ordered: true });
}

export async function findConflictingReservationSlot(slotLocks) {
  if (!slotLocks.length) {
    return null;
  }

  return getCollection(RESERVATION_SLOT_LOCKS_RESOURCE).findOne(
    {
      $or: slotLocks.map((slotLock) => ({
        courtId: slotLock.courtId,
        slotDate: slotLock.slotDate,
        slotStart: slotLock.slotStart,
      })),
    },
    { projection: { _id: 0 } },
  );
}

export async function releaseReservationSlotLocks(reservationIds) {
  const normalizedReservationIds = [...new Set(
    (Array.isArray(reservationIds) ? reservationIds : [reservationIds])
      .map((reservationId) => String(reservationId || "").trim())
      .filter(Boolean),
  )];

  if (!normalizedReservationIds.length) {
    return;
  }

  await getCollection(RESERVATION_SLOT_LOCKS_RESOURCE).deleteMany({
    reservationId: { $in: normalizedReservationIds },
  });
}

export function shouldHoldReservationSlots(status) {
  return !isCancelledStatus(status);
}
