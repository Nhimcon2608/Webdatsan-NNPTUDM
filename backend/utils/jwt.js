import jwt from "jsonwebtoken";

function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

function getJwtSecret() {
  return String(process.env.JWT_SECRET || "webdatsan-local-dev-secret").trim();
}

function getJwtExpiresIn() {
  return String(process.env.JWT_EXPIRES_IN || "7d").trim();
}

function getJwtIssuer() {
  return String(process.env.JWT_ISSUER || "webdatsan-backend").trim();
}

export function signAuthToken(account) {
  return jwt.sign(
    {
      sub: String(account?.id || ""),
      role: normalizeRole(account?.role),
      email: String(account?.email || ""),
      type: "access",
    },
    getJwtSecret(),
    {
      expiresIn: getJwtExpiresIn(),
      issuer: getJwtIssuer(),
    },
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(String(token || ""), getJwtSecret(), {
    issuer: getJwtIssuer(),
  });
}

export function toAuthErrorMessage(error) {
  if (!error) {
    return "Authentication required";
  }

  if (error.name === "TokenExpiredError") {
    return "Token expired";
  }

  if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
    return "Invalid token";
  }

  return "Authentication required";
}
