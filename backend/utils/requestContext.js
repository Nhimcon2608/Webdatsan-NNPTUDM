import { toAuthErrorMessage, verifyAuthToken } from "./jwt.js";

// Đọc token/header một lần rồi gắn auth context gọn nhẹ vào request.
export function attachRequestContext(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const token = headerToken || null;
  let tokenPayload = null;
  let authError = null;

  if (token) {
    try {
      tokenPayload = verifyAuthToken(token);
    } catch (error) {
      authError = {
        name: error?.name || "AuthError",
        message: toAuthErrorMessage(error),
      };
    }
  }

  req.context = {
    token,
    tokenPayload,
    accountId: tokenPayload?.sub ? String(tokenPayload.sub).trim() : null,
    account: undefined,
    role: tokenPayload?.role ? String(tokenPayload.role).trim().toUpperCase() : null,
    authError,
  };

  next();
}
