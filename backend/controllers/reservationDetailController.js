// Xử lý slot detail của reservation và tra cứu theo sân/ngày cho khung giờ đã đặt.
import { created, ok } from "../utils/response.js";
import { insert, list } from "../utils/store.js";
import {
  serializeReservationDetail,
} from "../utils/reservationView.js";

export async function createReservationDetail(req, res) {
  const payload = req.body || {};
  const createdRow = await insert("reservationDetails", payload);
  return created(
    res,
    serializeReservationDetail(createdRow, payload.playerName || "Khach le"),
    "Reservation detail created",
  );
}

export async function getReservationDetails(req, res) {
  // Khi có courtId, route này hoạt động như tra cứu chiếm chỗ đơn giản cho một sân trong một ngày.
  const { courtId, date } = req.query;
  const targetDate =
    !date || date === "today" ? new Date().toISOString().slice(0, 10) : String(date).slice(0, 10);

  if (!courtId) {
    return ok(res, await list("reservationDetails"));
  }

  const [rows, reservations, accounts, players] = await Promise.all([
    list("reservationDetails"),
    list("reservations"),
    list("accounts"),
    list("players"),
  ]);
  const reservationMap = new Map(reservations.map((reservation) => [reservation.id, reservation]));
  const playerMap = new Map(players.map((player) => [player.accountId, player]));
  const accountMap = new Map(accounts.map((account) => [account.id, account]));

  const todayRows = rows.filter((item) => {
    const targetCourtId = item.courtId || item.badmintonCourtId;
    const slotDate = item.slotDate || reservationMap.get(item.reservationId)?.bookDate;
    return targetCourtId === courtId && String(slotDate).slice(0, 10) === targetDate;
  });

  const serializedRows = todayRows.map((item) => {
    const reservation = reservationMap.get(item.reservationId);
    const player = reservation?.userAccountId ? playerMap.get(reservation.userAccountId) : null;
    const account = reservation?.userAccountId ? accountMap.get(reservation.userAccountId) : null;
    const playerName =
      reservation?.playerName ||
      player?.nickName ||
      account?.fullName ||
      account?.email ||
      "Khach le";

    return serializeReservationDetail(item, playerName);
  });

  return ok(res, serializedRows);
}
