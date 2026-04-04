export function attachRequestContext(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const queryToken = typeof req.query?.token === "string" ? req.query.token.trim() : null;
  const token = headerToken || queryToken || null;
  const tokenAccountId = token?.startsWith("mock-token-") ? token.slice("mock-token-".length) : null;
  const headerAccountId =
    typeof req.headers["x-account-id"] === "string" ? req.headers["x-account-id"].trim() : null;

  req.context = {
    token,
    accountId: tokenAccountId || headerAccountId || null,
    account: undefined,
    role: null,
  };

  next();
}
