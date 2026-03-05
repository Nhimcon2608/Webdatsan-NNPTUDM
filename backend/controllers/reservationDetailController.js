import { created, ok } from "../utils/response.js";
import { insert, list } from "../utils/store.js";

export function createReservationDetail(req, res) {
  const payload = req.body || {};
  const createdRow = insert("reservationDetails", payload);
  return created(res, createdRow, "Reservation detail created");
}

export function getTodaySlotsByCourt(req, res) {
  const { courtId } = req.params;
  const today = new Date().toISOString().slice(0, 10);

  const rows = list("reservationDetails").filter(
    (item) => item.courtId === courtId && String(item.slotDate).slice(0, 10) === today,
  );

  return ok(res, rows);
}
