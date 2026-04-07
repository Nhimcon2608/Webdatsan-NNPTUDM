// Đọc và cập nhật player profile thuộc về account đang đăng nhập.
import { getRequestAccount } from "../middleware/auth.js";
import { ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

function buildDefaultPlayerProfile(account) {
  const displayName =
    account?.fullName || account?.username || account?.email?.split("@")[0] || "Player";
  const imagePath = account?.imagePath || account?.avatarUrl || "";

  return {
    accountId: account?.id || "",
    fullName: account?.fullName || "",
    email: account?.email || "",
    phoneNumber: account?.phoneNumber || "",
    nickName: displayName,
    level: "BEGINNER",
    gender: account?.gender ?? "",
    dob: account?.dob ?? "",
    imagePath,
    avatarUrl: account?.avatarUrl || imagePath,
  };
}

export async function getCurrentPlayer(req, res) {
  const account = await getRequestAccount(req);
  const accountId = req.context.accountId;
  const player = (await list("players")).find((item) => item.accountId === accountId);

  if (player) {
    return ok(res, player);
  }

  if (!account) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (req.context.role !== "USER") {
    return res.status(404).json({ success: false, message: "Player profile not found" });
  }

  const created = await insert("players", buildDefaultPlayerProfile(account));
  return ok(res, created, "Player profile created");
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
