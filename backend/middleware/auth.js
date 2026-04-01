import { findById } from "../utils/store.js";

function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

export async function getRequestAccount(req) {
  if (req.context?.account !== undefined) {
    return req.context.account;
  }

  const accountId = req.context?.accountId;
  if (!accountId) {
    req.context = {
      ...(req.context || {}),
      account: null,
      role: null,
    };
    return null;
  }

  const account = await findById("accounts", accountId);

  req.context = {
    ...(req.context || {}),
    account,
    role: normalizeRole(account?.role),
  };

  return account;
}

export async function requireAuth(req, res, next) {
  const account = await getRequestAccount(req);

  if (!account) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return next();
}

export function requireRoles(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole).filter(Boolean);

  return async function roleGuard(req, res, next) {
    const account = await getRequestAccount(req);

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!normalizedAllowedRoles.includes(req.context?.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return next();
  };
}
