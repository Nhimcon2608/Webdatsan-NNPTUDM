// Ghép nhiều collection để tạo payload temporary recruitment sẵn sàng cho frontend.
import { toPublicAccount } from "./accountView.js";
import { serializeBranch } from "./branchView.js";
import {
  buildReservationDetailsMap,
  serializeReservation,
  serializeReservationDetail,
} from "./reservationView.js";
import { list } from "./store.js";

function inferOrdinalNumber(court, index = 0) {
  if (court?.ordinalNumber != null && court.ordinalNumber !== "") {
    const parsed = Number(court.ordinalNumber);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const matched = String(court?.name || "").match(/(\d+)/);
  if (matched) {
    return Number(matched[1]);
  }

  return index + 1;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeContent(content, quantity) {
  const normalized = String(content || "").trim();
  if (normalized) {
    return normalized;
  }

  return quantity > 0 ? `Tuyển thêm ${quantity} người chơi.` : "";
}

function buildCourtRentalInformations(rawDetails, courtsById, playerName) {
  return rawDetails
    .map((detail, index) => {
      const serialized = serializeReservationDetail(detail, playerName);
      const courtId = serialized.badmintonCourtId || serialized.courtId || detail?.courtId || "";
      const court = courtsById.get(courtId) || null;
      const ordinalNumber = inferOrdinalNumber(court, index);

      return {
        ...serialized,
        badmintonCourtId: courtId,
        courtId,
        ordinalNumber,
        courtName: detail?.courtName || court?.name || `Sân ${ordinalNumber}`,
      };
    })
    .sort((left, right) => String(left.startTime || "").localeCompare(String(right.startTime || "")));
}

export async function buildTemporaryRecruitmentContext() {
  // Tải các collection liên quan một lần để serialize từng recruitment nhất quán hơn.
  const [
    accounts,
    players,
    branches,
    reservations,
    reservationDetails,
    badmintonCourts,
    temporaryRecruitments,
  ] = await Promise.all([
    list("accounts"),
    list("players"),
    list("branches"),
    list("reservations"),
    list("reservationDetails"),
    list("badmintonCourts"),
    list("temporaryRecruitments"),
  ]);

  return {
    accounts,
    players,
    temporaryRecruitments,
    accountsById: new Map(accounts.map((item) => [item.id, item])),
    playersByAccountId: new Map(players.map((item) => [item.accountId, item])),
    branchesById: new Map(branches.map((item) => [item.id, item])),
    reservationsById: new Map(reservations.map((item) => [item.id, item])),
    temporaryRecruitmentsById: new Map(temporaryRecruitments.map((item) => [item.id, item])),
    courtsById: new Map(
      badmintonCourts.map((item, index) => [
        item.id,
        {
          ...item,
          ordinalNumber: inferOrdinalNumber(item, index),
        },
      ]),
    ),
    detailsByReservationId: buildReservationDetailsMap(reservationDetails),
  };
}

export function serializeTemporaryRecruitment(row, context) {
  if (!row) {
    return null;
  }

  const reservationSource = context.reservationsById.get(row.reservationId) || null;
  const reservation = reservationSource
    ? serializeReservation(reservationSource, {
        detailsByReservationId: context.detailsByReservationId,
        accounts: context.accounts,
        players: context.players,
      })
    : null;
  const branchId = row.branchId || reservation?.branchId || reservationSource?.branchId || "";
  const branchSource = context.branchesById.get(branchId) || null;
  const branch = serializeBranch(branchSource);
  const accountId =
    row.accountId ||
    row.userAccountId ||
    reservation?.userAccountId ||
    reservationSource?.userAccountId ||
    "";
  const publicAccount = toPublicAccount(context.accountsById.get(accountId));
  const player = context.playersByAccountId.get(accountId) || null;
  const username =
    row.username || player?.nickName || publicAccount?.username || publicAccount?.fullName || "Người chơi";
  const rawDetails = row.badmintonCourtRentalInformations || reservation?.reservationDetails || [];
  const badmintonCourtRentalInformations = buildCourtRentalInformations(
    rawDetails,
    context.courtsById,
    username,
  );
  const createdAt = row.createdAt || row.createAt || reservation?.createdAt || "";
  const bookAt =
    row.bookAt ||
    row.bookDate ||
    reservation?.bookAt ||
    reservation?.bookDate ||
    badmintonCourtRentalInformations[0]?.slotDate ||
    "";
  const quantity = Math.max(toNumber(row.quantity ?? row.availablePlayers ?? row.slots, 1), 1);
  const imagePath = row.imagePath || row.avatarUrl || publicAccount?.imagePath || publicAccount?.avatarUrl || "";

  return {
    ...row,
    id: row.id || row.temporaryRecruitmentId || "",
    temporaryRecruitmentId: row.temporaryRecruitmentId || row.id || "",
    reservationId: row.reservationId || reservation?.id || "",
    branchId,
    accountId,
    available: row.available ?? true,
    quantity,
    content: normalizeContent(row.content || row.description, quantity),
    username,
    imagePath,
    avatarUrl: imagePath,
    branchName: row.branchName || branch?.branchName || branch?.name || "",
    address: row.address || branch?.address || "",
    bookAt,
    bookDate: row.bookDate || String(bookAt || "").slice(0, 10),
    createAt: row.createAt || createdAt,
    createdAt,
    badmintonCourtRentalInformations,
    reservation,
    branch,
    account: publicAccount,
  };
}
