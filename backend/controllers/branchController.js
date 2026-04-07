// Xử lý CRUD branch, serialize branch và cập nhật ảnh branch.
import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import { serializeBranch } from "../utils/branchView.js";
import { deleteUploadedFile, persistUploadedFile } from "../utils/uploadStorage.js";

function slugify(value) {
  return String(value || "manager")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

function getUploadedFile(req) {
  return req.file || req.files?.[0] || null;
}

function normalizeCredential(value) {
  return String(value || "").trim().toLowerCase();
}

function resolveRequestOwnerName(request, payload) {
  return (
    request?.ownerName ||
    request?.owner?.ownerName ||
    request?.owner?.fullName ||
    payload?.ownerName ||
    ""
  );
}

function buildManagerEmail(payload, request, username) {
  const explicitEmail = normalizeCredential(
    payload?.accountRequest?.email || payload?.email || request?.ownerEmail || request?.owner?.email,
  );

  if (explicitEmail) {
    return explicitEmail;
  }

  return `${slugify(username || resolveRequestOwnerName(request, payload) || "manager")}@webdatsan.vn`;
}

function buildManagerUsername(payload, request) {
  const explicitUsername = String(payload?.accountRequest?.username || payload?.username || "")
    .trim()
    .toLowerCase();

  if (explicitUsername) {
    return explicitUsername;
  }

  const email = buildManagerEmail(payload, request, "");
  return email.split("@")[0];
}

function buildManagerPhoneNumber(payload, request) {
  return String(
    payload?.accountRequest?.phoneNumber ||
      payload?.phoneNumber ||
      request?.ownerPhoneNumber ||
      request?.owner?.phoneNumber ||
      "",
  ).trim();
}

function buildManagerAccountInput(payload, request) {
  const username = buildManagerUsername(payload, request);

  return {
    email: buildManagerEmail(payload, request, username),
    username,
    password: String(payload?.accountRequest?.password || payload?.password || "123456"),
    fullName: resolveRequestOwnerName(request, payload) || payload?.branchName || "Manager",
    phoneNumber: buildManagerPhoneNumber(payload, request),
  };
}

function findMatchingManagerAccount(accounts, accountInput) {
  return accounts.find((account) => {
    const normalizedAccountEmail = normalizeCredential(account?.email);
    const normalizedAccountUsername = normalizeCredential(account?.username);

    return Boolean(
      (accountInput.email && normalizedAccountEmail === accountInput.email) ||
        (accountInput.username && normalizedAccountUsername === accountInput.username) ||
        (accountInput.phoneNumber && account?.phoneNumber === accountInput.phoneNumber),
    );
  });
}

async function ensureManagerAccount(accountInput, existingAccount = null) {
  if (existingAccount) {
    const patch = {
      role: existingAccount.role === "ADMIN" ? "ADMIN" : "MANAGER",
    };

    if (!existingAccount.email && accountInput.email) {
      patch.email = accountInput.email;
    }

    if (!existingAccount.username && accountInput.username) {
      patch.username = accountInput.username;
    }

    if (
      accountInput.fullName &&
      (!existingAccount.fullName || existingAccount.fullName === existingAccount.email)
    ) {
      patch.fullName = accountInput.fullName;
    }

    if (!existingAccount.phoneNumber && accountInput.phoneNumber) {
      patch.phoneNumber = accountInput.phoneNumber;
    }

    return updateById("accounts", existingAccount.id, patch);
  }

  return insert("accounts", {
    email: accountInput.email,
    username: accountInput.username,
    password: accountInput.password,
    fullName: accountInput.fullName,
    phoneNumber: accountInput.phoneNumber,
    role: "MANAGER",
    avatarUrl: "",
  });
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
    const relatedRequest = await findById("partnershipRequests", partnershipRequestId);
    branches = branches.filter(
      (item) =>
        item.partnershipRequestId === partnershipRequestId ||
        (relatedRequest?.branchId && item.id === relatedRequest.branchId),
    );
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
  const payload = req.body || {};
  const partnershipRequestId = String(payload?.partnershipRequestId || "").trim();
  const relatedRequest = partnershipRequestId
    ? await findById("partnershipRequests", partnershipRequestId)
    : null;
  const branches = await list("branches");

  if (partnershipRequestId) {
    const existingBranch = branches.find(
      (branch) =>
        branch.partnershipRequestId === partnershipRequestId ||
        (relatedRequest?.branchId && branch.id === relatedRequest.branchId),
    );

    if (existingBranch) {
      const context = await loadBranchContext();
      return ok(
        res,
        serializeBranches([existingBranch], context)[0],
        "Branch already exists for partnership request",
      );
    }
  }

  const accountInput = buildManagerAccountInput(payload, relatedRequest);
  const accounts = await list("accounts");
  const existingAccount = findMatchingManagerAccount(accounts, accountInput);

  if (partnershipRequestId && existingAccount) {
    const existingManagerBranch = branches.find(
      (branch) => branch.managerAccountId === existingAccount.id,
    );

    if (existingManagerBranch) {
      await updateById("partnershipRequests", relatedRequest.id, {
        status: "approved",
        branchId: existingManagerBranch.id,
      });

      const context = await loadBranchContext();
      return ok(
        res,
        serializeBranches([existingManagerBranch], context)[0],
        "Existing branch reused for manager account",
      );
    }
  }

  const managerAccount = await ensureManagerAccount(accountInput, existingAccount);
  const createdBranch = await insert("branches", {
    ...payload,
    name: payload?.name || payload?.branchName,
    branchName: payload?.branchName || payload?.name,
    ownerId: payload?.ownerId || relatedRequest?.ownerId || "",
    managerAccountId: payload?.managerAccountId || managerAccount?.id || "",
    partnershipRequestId,
    email: payload?.email || relatedRequest?.ownerEmail || managerAccount?.email || "",
    phoneNumber: payload?.phoneNumber || payload?.accountRequest?.phoneNumber || "",
    isCooperated: payload?.isCooperated ?? payload?.cooperated ?? true,
    status: payload?.status || "ACTIVE",
  });

  if (relatedRequest) {
    await updateById("partnershipRequests", relatedRequest.id, {
      status: "approved",
      branchId: createdBranch.id,
    });
  }

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
