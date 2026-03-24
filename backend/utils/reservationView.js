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
    const [hours = "00", minutes = "00", seconds] = value.split(":");
    const normalizedHours = String(hours).padStart(2, "0");
    const normalizedMinutes = String(minutes).padStart(2, "0");
    return seconds != null
      ? `${normalizedHours}:${normalizedMinutes}:${String(seconds).padStart(2, "0")}`
      : `${normalizedHours}:${normalizedMinutes}`;
  }

  const hourValue = toHourNumber(value);
  const hours = Math.floor(hourValue);
  const minutes = Math.round((hourValue - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function computeRentalHours(startTime, endTime) {
  const start = toHourNumber(startTime);
  const end = toHourNumber(endTime);
  return Math.max(end - start, 0.5);
}

export function normalizeReservationStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  switch (normalized) {
    case "booked":
    case "pending":
    case "waiting":
      return "waiting";
    case "checked":
    case "checked_in":
    case "checkin":
      return "checked";
    case "finish":
    case "finished":
    case "completed":
    case "paid":
      return "finish";
    case "cancel":
    case "cancelled":
    case "canceled":
    case "scheduled_cancel":
      return "cancel";
    case "awaiting_payment":
      return "awaiting_payment";
    default:
      return normalized || "waiting";
  }
}

export function isCancelledStatus(status) {
  return normalizeReservationStatus(status) === "cancel";
}

function resolvePlayerName(reservation, accounts, players) {
  const player = players.find((item) => item.accountId === reservation.userAccountId);
  const account = accounts.find((item) => item.id === reservation.userAccountId);

  return (
    reservation.playerName ||
    player?.nickName ||
    account?.fullName ||
    account?.username ||
    account?.email ||
    "Khach le"
  );
}

export function buildReservationDetailsMap(details) {
  const detailsMap = new Map();

  for (const detail of details) {
    const reservationId = detail.reservationId;
    if (!reservationId) {
      continue;
    }

    if (!detailsMap.has(reservationId)) {
      detailsMap.set(reservationId, []);
    }

    detailsMap.get(reservationId).push(detail);
  }

  return detailsMap;
}

export function serializeReservationDetail(detail, playerName) {
  const startTime = toTimeString(detail.startTime || detail.slotStart || "00:00");
  const endTimeSource = detail.endTime || detail.slotEnd;
  const rentalTime =
    Number(detail.rentalTime) ||
    computeRentalHours(startTime, endTimeSource || detail.startTime || detail.slotStart);

  return {
    ...detail,
    badmintonCourtId: detail.badmintonCourtId || detail.courtId || "",
    courtId: detail.courtId || detail.badmintonCourtId || "",
    startTime,
    endTime: endTimeSource ? toTimeString(endTimeSource) : undefined,
    rentalTime,
    extendedTime: Number(detail.extendedTime || 0),
    playerName,
  };
}

export function serializeReservation(reservation, context) {
  const { detailsByReservationId, accounts, players } = context;
  const playerName = resolvePlayerName(reservation, accounts, players);
  const rawDetails = detailsByReservationId.get(reservation.id) || [];
  const reservationDetails = rawDetails.map((detail) =>
    serializeReservationDetail(detail, playerName),
  );
  const firstDetail = reservationDetails[0];
  const bookAt = reservation.bookAt || reservation.bookDate || reservation.createdAt || "";

  return {
    ...reservation,
    playerName,
    status: normalizeReservationStatus(reservation.status),
    bookAt,
    bookDate: reservation.bookDate || String(bookAt).slice(0, 10),
    totalPrice: Number(reservation.totalPrice ?? reservation.amount ?? reservation.total ?? 0),
    deposit: Number(reservation.deposit || 0),
    reservationDetails,
    startTime: firstDetail?.startTime || reservation.startTime || "",
    courtId: reservation.courtId || firstDetail?.badmintonCourtId || "",
  };
}
