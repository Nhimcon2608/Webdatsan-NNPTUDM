import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

export function getBranchesByCooperated(req, res) {
  const { isCooperated } = req.params;
  const data = list("branches").filter((item) => item.isCooperated === toBoolean(isCooperated));
  return ok(res, data);
}

export function getBranchById(req, res) {
  const branch = findById("branches", req.params.branchId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  return ok(res, branch);
}

export function getBranchByPartnershipRequest(req, res) {
  const { requestId } = req.params;
  const branch = list("branches").find((item) => item.partnershipRequestId === requestId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  return ok(res, branch);
}

export function createBranch(req, res) {
  const createdBranch = insert("branches", {
    ...req.body,
    isCooperated: req.body?.isCooperated ?? false,
    status: req.body?.status || "INACTIVE",
  });
  return created(res, createdBranch, "Branch created");
}

export function updateBranchStatus(req, res) {
  const { branchId } = req.params;
  const isCooperated = req.body?.isCooperated ?? req.body?.cooperated ?? req.body;
  const updated = updateById("branches", branchId, {
    isCooperated: toBoolean(isCooperated),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  return ok(res, updated, "Branch cooperation updated");
}

export function getBranchByManager(req, res) {
  const { accountId } = req.params;
  const branch = list("branches").find((item) => item.managerAccountId === accountId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  return ok(res, branch);
}

export function updateBranch(req, res) {
  const { branchId } = req.params;
  const existing = findById("branches", branchId);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  const updated = updateById("branches", branchId, req.body || {});
  return ok(res, updated, "Branch updated");
}
