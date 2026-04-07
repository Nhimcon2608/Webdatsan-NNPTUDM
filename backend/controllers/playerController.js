// Đọc và cập nhật player profile thuộc về account đang đăng nhập.
import { ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export async function getCurrentPlayer(req, res) {
  const accountId = req.context.accountId;
  const player = (await list("players")).find((item) => item.accountId === accountId);

  if (!player) {
    return res.status(404).json({ success: false, message: "Player profile not found" });
  }

  return ok(res, player);
}

export async function updateCurrentPlayer(req, res) {
  // Lần cập nhật đầu tiên sẽ tạo profile nếu user chưa có.
  const payload = req.body || {};
  const accountId = req.context.accountId;

  const existing = (await list("players")).find((item) => item.accountId === accountId);
  if (!existing) {
    const created = await insert("players", {
      accountId,
      nickName: payload.nickName || payload.fullName || "Player",
      level: payload.level || "BEGINNER",
      ...payload,
    });
    return ok(res, created, "Profile created");
  }

  const updated = await updateById("players", existing.id, payload);
  return ok(res, updated, "Profile updated");
}
