export function attachRequestContext(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const tokenAccountId = token?.startsWith("mock-token-") ? token.slice("mock-token-".length) : null;

  req.context = {
    token,
    accountId: req.headers["x-account-id"] || tokenAccountId || "acc-1",
  };

  next();
}
