export function attachRequestContext(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  req.context = {
    token,
    accountId: req.headers["x-account-id"] || "acc-1",
  };

  next();
}
