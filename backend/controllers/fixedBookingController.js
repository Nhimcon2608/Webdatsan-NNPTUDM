import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

export function createFixedBooking(req, res) {
  const payload = req.body || {};
  const repeatCount = Number(payload.repeatCount || 4);

  const createdReservationIds = [];
  for (let i = 0; i < repeatCount; i += 1) {
    const reservation = insert("reservations", {
      ...payload,
      status: payload.status || "PENDING",
      isFixedBooking: true,
      fixedBookingSeq: i + 1,
      userAccountId: payload.userAccountId || req.context.accountId,
      bookDate: payload.bookDate || new Date().toISOString().slice(0, 10),
    });
    createdReservationIds.push(reservation.id);
  }

  const fixedBooking = insert("fixedBookings", {
    reservationIds: createdReservationIds,
    status: "PENDING",
  });

  return created(
    res,
    {
      fixedBooking,
      reservationIds: createdReservationIds,
    },
    "Fixed booking created",
  );
}

export function updateFixedBookingStatus(req, res) {
  const reservationIds = req.body?.reservationIds || [];
  const status = String(req.body?.status || "PENDING").toUpperCase();

  const updatedReservations = reservationIds
    .map((id) => updateById("reservations", String(id), { status }))
    .filter(Boolean);

  const fixedBooking = list("fixedBookings").find((item) => {
    const ids = item.reservationIds || [];
    return reservationIds.every((id) => ids.includes(String(id)));
  });

  const updatedFixedBooking = fixedBooking
    ? updateById("fixedBookings", fixedBooking.id, { status })
    : null;

  return ok(
    res,
    {
      status,
      updatedReservations,
      updatedFixedBooking,
    },
    "Fixed booking status updated",
  );
}
