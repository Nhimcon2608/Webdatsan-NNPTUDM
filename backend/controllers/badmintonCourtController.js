// Quản lý danh sách court, trạng thái và tạo mới trong branch.
import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toStatus(value) {
  if (typeof value === "boolean") {
    return value ? "ACTIVE" : "INACTIVE";
  }

  const normalized = String(value || "").trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  return normalized;
}

function normalizeStatusFilter(value) {
  if (value == null || String(value).trim() === "") {
    return null;
  }

  const normalized = String(value).trim().toUpperCase();

  if (normalized === "TRUE" || normalized === "AVAILABLE") {
    return "ACTIVE";
  }

  if (normalized === "FALSE" || normalized === "UNAVAILABLE") {
    return "INACTIVE";
  }

  return normalized;
}

function inferOrdinalNumber(court) {
  if (court?.ordinalNumber != null && court.ordinalNumber !== "") {
    const parsed = Number(court.ordinalNumber);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const matched = String(court?.name || "").match(/(\d+)/);
  if (matched) {
    return Number(matched[1]);
  }

  return null;
}

function toOrdinalNumber(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function getCourts(req, res) {
  const { branchId, managerAccountId, status } = req.query;
  let rows = await list("badmintonCourts");

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (managerAccountId) {
    rows = rows.filter((item) => item.managerAccountId === managerAccountId);
  }

  if (status && String(status).toLowerCase() !== "all") {
    const normalizedStatus = normalizeStatusFilter(status);
    rows = rows.filter(
      (item) => String(item.status || "").toUpperCase() === normalizedStatus,
    );
  }

  return ok(res, rows);
}

export async function updateCourt(req, res) {
  const { courtId } = req.params;
  const current = (await list("badmintonCourts")).find((item) => item.id === courtId);

  if (!current) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const patch = { ...(req.body || {}) };
  const explicitStatus = toStatus(patch.status ?? patch.available);

  if (explicitStatus) {
    patch.status = explicitStatus;
  } else if (!Object.keys(patch).length) {
    patch.status = current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  }

  delete patch.available;

  const updated = await updateById("badmintonCourts", courtId, patch);
  return ok(res, updated, "Court updated");
}

export async function createCourt(req, res) {
  const payload = req.body || {};
  const branchId = String(payload.branchId || "").trim();
  const ordinalNumber = toOrdinalNumber(payload.ordinalNumber);
  const { available, ...restPayload } = payload;

  if (!branchId) {
    return res.status(400).json({
      success: false,
      message: "Branch ID is required",
    });
  }

  if (!ordinalNumber) {
    return res.status(400).json({
      success: false,
      message: "Ordinal number must be a positive integer",
    });
  }

  const branch = await findById("branches", branchId);
  if (!branch) {
    return res.status(404).json({
      success: false,
      message: "Branch not found",
    });
  }

  if (
    req.context?.role === "MANAGER" &&
    branch.managerAccountId &&
    branch.managerAccountId !== req.context.accountId
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const existingCourts = await list("badmintonCourts");
  const duplicatedCourt = existingCourts.find(
    (item) => item.branchId === branchId && inferOrdinalNumber(item) === ordinalNumber,
  );

  if (duplicatedCourt) {
    return res.status(409).json({
      success: false,
      message: "Court ordinal number already exists in this branch",
    });
  }

  const managerAccountId = String(
    restPayload.managerAccountId ||
      branch.managerAccountId ||
      (req.context?.role === "MANAGER" ? req.context.accountId : ""),
  ).trim();
  const status = toStatus(restPayload.status ?? available) || "ACTIVE";
  const createdCourt = await insert("badmintonCourts", {
    ...restPayload,
    branchId,
    ordinalNumber,
    managerAccountId,
    name: restPayload.name || `Sân ${ordinalNumber}`,
    status,
    images: Array.isArray(restPayload.images) ? restPayload.images : [],
  });

  return created(res, createdCourt, "Court created");
}
