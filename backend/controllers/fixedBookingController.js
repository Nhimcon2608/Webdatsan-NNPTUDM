// Tạo nhóm booking lặp lại bằng cách sinh nhiều reservation.
import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

export async function getFixedBookings(req, res) {
  const { reservationId } = req.query;
  let rows = await list("fixedBookings");

  if (reservationId) {
    rows = rows.filter((item) => (item.reservationIds || []).includes(String(reservationId)));
  }

  return ok(res, rows);
}

export async function createFixedBooking(req, res) {
  // Bản ghi fixed booking chỉ lưu các reservation id đã sinh và một trạng thái dùng chung.
  const payload = req.body || {};
  const repeatCount = Number(payload.repeatCount || 4);

  const createdReservationIds = [];
  for (let i = 0; i < repeatCount; i += 1) {
    const reservation = await insert("reservations", {
      ...payload,
      status: payload.status || "PENDING",
      isFixedBooking: true,
      fixedBookingSeq: i + 1,
      userAccountId: payload.userAccountId || req.context.accountId,
      bookDate: payload.bookDate || new Date().toISOString().slice(0, 10),
    });
    createdReservationIds.push(reservation.id);
  }

  const fixedBooking = await insert("fixedBookings", {
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

export async function updateFixedBooking(req, res) {
  const { fixedBookingId } = req.params;
  const fixedBooking = await findById("fixedBookings", fixedBookingId);

  if (!fixedBooking) {
    return res.status(404).json({ success: false, message: "Fixed booking not found" });
  }

  const status = String(req.body?.status || fixedBooking.status || "PENDING").toUpperCase();
  const reservationIds = fixedBooking.reservationIds || [];

  const updatedReservations = (
    await Promise.all(
      reservationIds.map((id) => updateById("reservations", String(id), { status })),
    )
  ).filter(Boolean);

  const updatedFixedBooking = await updateById("fixedBookings", fixedBooking.id, { status });

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
