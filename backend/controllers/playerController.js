import { ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export function getPlayerByAccountId(req, res) {
  const { accountId } = req.params;
  const player = list("players").find((item) => item.accountId === accountId);

  if (!player) {
    return res.status(404).json({ success: false, message: "Player profile not found" });
  }

  return ok(res, player);
}

export function updatePlayer(req, res) {
  const payload = req.body || {};
  const accountId = payload.accountId || req.context.accountId;

  const existing = list("players").find((item) => item.accountId === accountId);
  if (!existing) {
    const created = insert("players", {
      accountId,
      nickName: payload.nickName || payload.fullName || "Player",
      level: payload.level || "BEGINNER",
      ...payload,
    });
    return ok(res, created, "Profile created");
  }

  const updated = updateById("players", existing.id, payload);
  return ok(res, updated, "Profile updated");
}
