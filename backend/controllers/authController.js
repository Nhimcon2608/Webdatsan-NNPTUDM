// Xử lý login, register và logout.
import { created, ok } from "../utils/response.js";
import { insert, list } from "../utils/store.js";
import { toPublicAccount } from "../utils/accountView.js";
import { signAuthToken } from "../utils/jwt.js";

export async function login(req, res) {
  // Login chấp nhận email hoặc username và trả JWT.
  const payload = req.body || {};
  const credential = String(payload.email || payload.username || "")
    .trim()
    .toLowerCase();
  const password = String(payload.password || "");
  const account = (await list("accounts")).find(
    (item) =>
      (item.email?.toLowerCase() === credential || item.username?.toLowerCase() === credential) &&
      item.password === password,
  );

  if (!account) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  return ok(
    res,
    {
      token: signAuthToken(account),
      account: toPublicAccount(account),
    },
    "Login successful",
  );
}

export async function register(req, res) {
  // Register mặc định tạo account USER nếu không truyền role.
  const payload = req.body || {};
  const email = String(payload.email || payload.username || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return res.status(400).json({ success: false, message: "email is required" });
  }

  const accounts = await list("accounts");
  const existing = accounts.find((item) => item.email.toLowerCase() === email);
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already exists" });
  }

  const account = await insert("accounts", {
    email,
    username: payload.username || "",
    password: payload.password || "123456",
    fullName: payload.fullName || payload.username || email,
    phoneNumber: payload.phoneNumber || "",
    role: payload.role || "USER",
    avatarUrl: "",
  });

  return created(res, toPublicAccount(account), "Register successful");
}

export function logout(_req, res) {
  return ok(res, null, "Logout successful");
}
