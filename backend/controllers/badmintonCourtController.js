import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

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
    rows = rows.filter((item) => item.status.toLowerCase() === String(status).toLowerCase());
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
  const createdCourt = await insert("badmintonCourts", {
    ...payload,
    status: payload.status || "ACTIVE",
    images: payload.images || [],
  });

  return created(res, createdCourt, "Court created");
}
