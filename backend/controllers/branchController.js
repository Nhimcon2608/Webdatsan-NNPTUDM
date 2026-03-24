import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import { serializeBranch } from "../utils/branchView.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

async function loadBranchContext() {
  const [owners, partnershipRequests] = await Promise.all([
    list("owners"),
    list("partnershipRequests"),
  ]);

  return { owners, partnershipRequests };
}

function findRelatedOwner(branch, owners, request) {
  return owners.find(
    (owner) =>
      owner.id === branch.ownerId ||
      owner.ownerName === request?.ownerName ||
      owner.fullName === request?.ownerName,
  );
}

function serializeBranches(branches, context) {
  const { owners, partnershipRequests } = context;

  return branches.map((branch) => {
    const request = partnershipRequests.find(
      (item) => item.id === branch.partnershipRequestId || item.branchId === branch.id,
    );
    const owner = findRelatedOwner(branch, owners, request);
    return serializeBranch(branch, { owner, request });
  });
}

export async function getBranchesByCooperated(req, res) {
  const { isCooperated } = req.params;
  const branches = await list("branches");
  const filteredBranches =
    String(isCooperated).toLowerCase() === "all"
      ? branches
      : branches.filter((item) => item.isCooperated === toBoolean(isCooperated));
  const context = await loadBranchContext();
  return ok(res, serializeBranches(filteredBranches, context));
}

export async function getBranchById(req, res) {
  const branch = await findById("branches", req.params.branchId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  const context = await loadBranchContext();
  return ok(res, serializeBranches([branch], context)[0]);
}

export async function getBranchByPartnershipRequest(req, res) {
  const { requestId } = req.params;
  const branch = (await list("branches")).find((item) => item.partnershipRequestId === requestId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  const context = await loadBranchContext();
  return ok(res, serializeBranches([branch], context)[0]);
}

export async function createBranch(req, res) {
  const createdBranch = await insert("branches", {
    ...req.body,
    name: req.body?.name || req.body?.branchName,
    branchName: req.body?.branchName || req.body?.name,
    phoneNumber: req.body?.phoneNumber || req.body?.accountRequest?.phoneNumber || "",
    isCooperated: req.body?.isCooperated ?? req.body?.cooperated ?? true,
    status: req.body?.status || "ACTIVE",
  });
  const context = await loadBranchContext();
  return created(res, serializeBranches([createdBranch], context)[0], "Branch created");
}

export async function updateBranchStatus(req, res) {
  const { branchId } = req.params;
  const isCooperated = req.body?.isCooperated ?? req.body?.cooperated ?? req.body;
  const updated = await updateById("branches", branchId, {
    isCooperated: toBoolean(isCooperated),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  const context = await loadBranchContext();
  return ok(res, serializeBranches([updated], context)[0], "Branch cooperation updated");
}

export async function getBranchByManager(req, res) {
  const { accountId } = req.params;
  const branch = (await list("branches")).find((item) => item.managerAccountId === accountId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  const context = await loadBranchContext();
  return ok(res, serializeBranches([branch], context)[0]);
}

export async function updateBranch(req, res) {
  const { branchId } = req.params;
  const existing = await findById("branches", branchId);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  const updated = await updateById("branches", branchId, req.body || {});
  const context = await loadBranchContext();
  return ok(res, serializeBranches([updated], context)[0], "Branch updated");
}
