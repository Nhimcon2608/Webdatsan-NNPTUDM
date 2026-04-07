// Xử lý đọc/sửa profile account, đổi mật khẩu và upload avatar.
import { ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import { toPublicAccount } from "../utils/accountView.js";
import { sendResetPasswordEmail } from "../utils/mailService.js";
import { generateRandomPassword } from "../utils/passwords.js";
import { persistUploadedFile } from "../utils/uploadStorage.js";

// Các endpoint của account luôn lấy account hiện tại từ request context.
function resolveAccountId(req) {
  return req.context.accountId || null;
}

function getUploadedFile(req) {
  return req.file || req.files?.[0] || null;
}

export async function getMe(req, res) {
  const accountId = resolveAccountId(req);
  const account = await findById("accounts", accountId);

  if (!account) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, toPublicAccount(account));
}

export async function getAllAccounts(_req, res) {
  const accounts = await list("accounts");
  return ok(res, accounts.map(toPublicAccount));
}

export async function adminResetPassword(req, res) {
  const accountId = String(req.params.accountId || "").trim();
  const account = await findById("accounts", accountId);

  if (!account) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  if (String(account.role || "").toUpperCase() === "ADMIN") {
    return res.status(403).json({ success: false, message: "Cannot reset admin password here" });
  }

  if (!account.email) {
    return res.status(400).json({ success: false, message: "Account email is required" });
  }

  const newPassword = generateRandomPassword();
  const previousPassword = account.password;
  const updated = await updateById("accounts", accountId, { password: newPassword });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  try {
    const delivery = await sendResetPasswordEmail({
      to: updated.email,
      recipientName: updated.fullName || updated.username || updated.email,
      newPassword,
    });

    const message =
      delivery.method === "smtp"
        ? "Password reset and email sent"
        : "Password reset. Email preview saved locally";

    return ok(
      res,
      {
        account: toPublicAccount(updated),
        delivery,
      },
      message,
    );
  } catch (error) {
    await updateById("accounts", accountId, { password: previousPassword });
    return res.status(503).json({
      success: false,
      message: "Password reset email could not be sent",
      details: error?.message || "Unknown mail error",
    });
  }
}

export async function changePassword(req, res) {
  const accountId = resolveAccountId(req);
  const { newPassword } = req.body || {};

  if (!newPassword) {
    return res.status(400).json({ success: false, message: "newPassword is required" });
  }

  const updated = await updateById("accounts", accountId, { password: newPassword });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, null, "Password updated");
}

export async function updateAccount(req, res) {
  const accountId = resolveAccountId(req);
  const payload = req.body || {};
  const patch = {};

  if (payload.phoneNumber !== undefined) {
    if (!payload.phoneNumber) {
      return res.status(400).json({ success: false, message: "phoneNumber is required" });
    }
    patch.phoneNumber = payload.phoneNumber;
  }

  if (payload.fullName) {
    patch.fullName = payload.fullName;
  }

  if (payload.avatarUrl) {
    patch.avatarUrl = payload.avatarUrl;
  }

  if (!Object.keys(patch).length) {
    return res.status(400).json({ success: false, message: "No updatable fields provided" });
  }

  const updated = await updateById("accounts", accountId, patch);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, toPublicAccount(updated), "Account updated");
}

export async function uploadImage(req, res) {
  const accountId = resolveAccountId(req);
  const file = getUploadedFile(req);
  const imageUrl =
    (await persistUploadedFile(file, ["accounts", accountId])) || req.body?.avatarUrl || "";

  const updated = await updateById("accounts", accountId, {
    avatarUrl: imageUrl,
    imagePath: imageUrl,
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Account not found" });
  }

  return ok(res, toPublicAccount(updated), "Avatar updated");
}

export async function ensureSeedAccount(_req, _res) {
  if (!(await list("accounts")).length) {
    await insert("accounts", {
      id: "acc-1",
      email: "manager@webdatsan.vn",
      password: "123456",
      fullName: "Demo Manager",
      role: "MANAGER",
    });
  }
}
