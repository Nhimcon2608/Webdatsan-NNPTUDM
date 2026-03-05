import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export function getCourtsByBranchAndStatus(req, res) {
  const { branchId, status } = req.params;
  const rows = list("badmintonCourts").filter(
    (item) => item.branchId === branchId && item.status.toLowerCase() === String(status).toLowerCase(),
  );
  return ok(res, rows);
}

export function getCourtsByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("badmintonCourts").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function getCourtsByManager(req, res) {
  const { accountId } = req.params;
  const rows = list("badmintonCourts").filter((item) => item.managerAccountId === accountId);
  return ok(res, rows);
}

export function toggleCourtStatus(req, res) {
  const { courtId } = req.params;
  const current = list("badmintonCourts").find((item) => item.id === courtId);

  if (!current) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const nextStatus = current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const updated = updateById("badmintonCourts", courtId, { status: nextStatus });
  return ok(res, updated, "Court status toggled");
}

export function createCourt(req, res) {
  const payload = req.body || {};
  const createdCourt = insert("badmintonCourts", {
    ...payload,
    status: payload.status || "ACTIVE",
    images: payload.images || [],
  });

  return created(res, createdCourt, "Court created");
}
