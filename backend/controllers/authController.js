import { created, ok } from "../utils/response.js";
import { insert, list } from "../utils/store.js";

export function login(req, res) {
  const { email, password } = req.body || {};
  const account = list("accounts").find(
    (item) => item.email === email && item.password === password,
  );

  if (!account) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  return ok(
    res,
    {
      token: `mock-token-${account.id}`,
      account: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
      },
    },
    "Login successful",
  );
}

export function register(req, res) {
  const payload = req.body || {};
  const account = insert("accounts", {
    email: payload.email,
    password: payload.password || "123456",
    fullName: payload.fullName || "New Account",
    phoneNumber: payload.phoneNumber || "",
    role: payload.role || "USER",
    avatarUrl: "",
  });

  return created(res, account, "Register successful");
}

export function logout(_req, res) {
  return ok(res, null, "Logout successful");
}
