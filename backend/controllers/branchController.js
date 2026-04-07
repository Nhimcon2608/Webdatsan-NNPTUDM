// Xử lý CRUD branch, serialize branch và cập nhật ảnh branch.
import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import { serializeBranch } from "../utils/branchView.js";
import { deleteUploadedFile, persistUploadedFile } from "../utils/uploadStorage.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

function getUploadedFile(req) {
  return req.file || req.files?.[0] || null;
}

// Response branch được làm giàu thêm bằng dữ liệu owner và partnership request.
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

export async function getBranches(req, res) {
  // Danh sách branch hỗ trợ các filter nhẹ dùng cho màn admin, manager và user.
  const { isCooperated, partnershipRequestId, managerAccountId } = req.query;
  let branches = await list("branches");

  if (isCooperated !== undefined && String(isCooperated).toLowerCase() !== "all") {
    branches = branches.filter((item) => item.isCooperated === toBoolean(isCooperated));
  }

  if (partnershipRequestId) {
    branches = branches.filter((item) => item.partnershipRequestId === partnershipRequestId);
  }

  if (managerAccountId) {
    branches = branches.filter((item) => item.managerAccountId === managerAccountId);
  }

  const context = await loadBranchContext();
  return ok(res, serializeBranches(branches, context));
}

export async function getBranchById(req, res) {
  const branch = await findById("branches", req.params.branchId);
  if (!branch) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }
  const context = await loadBranchContext();
  return ok(res, serializeBranches([branch], context)[0]);
}

export async function createBranch(req, res) {
  // Khi tạo mới cũng chuẩn hóa field legacy để frontend và backend vẫn tương thích.
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

export async function updateBranch(req, res) {
  // Manager chỉ được sửa branch của mình, còn admin có thể sửa mọi branch.
  const { branchId } = req.params;
  const existing = await findById("branches", branchId);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  if (
    req.context?.role === "MANAGER" &&
    existing.managerAccountId &&
    existing.managerAccountId !== req.context?.accountId
  ) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  // Ảnh branch được lưu dưới /uploads và ảnh cũ sẽ bị xóa sau khi thay thành công.
  const file = getUploadedFile(req);
  const uploadedImagePath = file
    ? await persistUploadedFile(file, ["branches", branchId])
    : null;
  const payload = { ...(req.body || {}) };

  if (uploadedImagePath) {
    payload.imagePath = uploadedImagePath;
  }

  if (payload.isCooperated !== undefined || payload.cooperated !== undefined) {
    payload.isCooperated = toBoolean(payload.isCooperated ?? payload.cooperated);
    delete payload.cooperated;
  }

  if (payload.branchName !== undefined && payload.name === undefined) {
    payload.name = payload.branchName;
  }

  if (payload.name !== undefined && payload.branchName === undefined) {
    payload.branchName = payload.name;
  }

  const previousImagePath = existing.imagePath || "";
  const nextImagePath = payload.imagePath;
  const updated = await updateById("branches", branchId, payload);

  if (!updated) {
    await deleteUploadedFile(uploadedImagePath);
    return res.status(404).json({ success: false, message: "Branch not found" });
  }

  if (nextImagePath !== undefined && nextImagePath !== previousImagePath) {
    await deleteUploadedFile(previousImagePath);
  }

  const context = await loadBranchContext();
  return ok(res, serializeBranches([updated], context)[0], "Branch updated");
}
