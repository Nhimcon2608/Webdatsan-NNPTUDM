import { toPublicAccount } from "./accountView.js";

function normalizeRatingLevel(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(5, numericValue));
}

export function buildReviewContext(accounts = [], players = []) {
  return {
    accountsById: new Map(accounts.map((item) => [item.id, item])),
    playersByAccountId: new Map(players.map((item) => [item.accountId, item])),
  };
}

export function serializeReview(row, context = buildReviewContext()) {
  const accountId = row?.accountId || "";
  const publicAccount = toPublicAccount(context.accountsById.get(accountId));
  const player = context.playersByAccountId.get(accountId) || null;
  const username =
    row?.username ||
    player?.nickName ||
    publicAccount?.username ||
    publicAccount?.fullName ||
    publicAccount?.email?.split("@")[0] ||
    "Người dùng";
  const ratingLevel = normalizeRatingLevel(row?.ratingLevel ?? row?.rating);
  const createAt = row?.createAt || row?.createdAt || "";

  return {
    ...row,
    accountId,
    username,
    playerId: row?.playerId || player?.id || "",
    ratingLevel,
    rating: ratingLevel,
    avatarUrl: row?.avatarUrl || publicAccount?.avatarUrl || "",
    imagePath: row?.imagePath || publicAccount?.imagePath || "",
    createAt,
    createdAt: row?.createdAt || createAt,
  };
}
