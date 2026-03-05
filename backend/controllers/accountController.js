import { ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function resolveAccountId(req) {
  const accountIdFromBody = req.body?.accountId;
  return accountIdFromBody || req.context.accountId || "acc-1";
}

export function getMe(req, res) {
  const accountId = resolveAccountId(req);
  const account = findById("accounts", accountId);

  if (!account) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, account);
}

export function changePassword(req, res) {
  const accountId = resolveAccountId(req);
  const { newPassword } = req.body || {};

  if (!newPassword) {
    return res.status(400).json({ success: false, message: "newPassword is required" });
  }

  const updated = updateById("accounts", accountId, { password: newPassword });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, null, "Password updated");
}

export function updatePhone(req, res) {
  const accountId = resolveAccountId(req);
  const { phoneNumber } = req.body || {};

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "phoneNumber is required" });
  }

  const updated = updateById("accounts", accountId, { phoneNumber });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, updated, "Phone number updated");
}

export function uploadImage(req, res) {
  const accountId = resolveAccountId(req);
  const imageUrl = req.file?.originalname
    ? `/uploads/accounts/${accountId}/${req.file.originalname}`
    : req.body?.avatarUrl || "";

  const updated = updateById("accounts", accountId, { avatarUrl: imageUrl });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, updated, "Avatar updated");
}

export function ensureSeedAccount(_req, _res) {
  if (!list("accounts").length) {
    insert("accounts", {
      id: "acc-1",
      email: "manager@webdatsan.vn",
      password: "123456",
      fullName: "Demo Manager",
      role: "MANAGER",
    });
  }
}
