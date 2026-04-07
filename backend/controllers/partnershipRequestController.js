// Xử lý gửi partnership request và luồng admin duyệt.
import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";
import {
  extractOwnerFromRequest,
  fallbackOwnerEmail,
  normalizePartnershipRequestStatus,
  serializePartnershipRequest,
} from "../utils/partnershipRequestView.js";

function resolveOwnerName(owner) {
  return owner?.ownerName || owner?.fullName || "";
}

function findMatchingOwner(owners, ownerInput) {
  return owners.find((owner) => {
    const existingOwnerName = resolveOwnerName(owner);

    return (
      (ownerInput.id && owner.id === ownerInput.id) ||
      (ownerInput.phoneNumber && owner.phoneNumber === ownerInput.phoneNumber) ||
      (ownerInput.email &&
        (owner.email === ownerInput.email || owner.ownerEmail === ownerInput.email)) ||
      (ownerInput.ownerName && existingOwnerName === ownerInput.ownerName)
    );
  });
}

async function ensureOwnerForRequest(payload) {
  const ownerInput = extractOwnerFromRequest(payload);
  const owners = await list("owners");
  const existingOwner = findMatchingOwner(owners, ownerInput);

  if (existingOwner) {
    const patch = {};
    const existingOwnerName = resolveOwnerName(existingOwner);

    if (ownerInput.ownerName && !existingOwnerName) {
      patch.fullName = ownerInput.ownerName;
      patch.ownerName = ownerInput.ownerName;
    }

    if (ownerInput.email && !existingOwner.email) {
      patch.email = ownerInput.email;
    }

    if (ownerInput.phoneNumber && !existingOwner.phoneNumber) {
      patch.phoneNumber = ownerInput.phoneNumber;
    }

    const resolvedOwner = Object.keys(patch).length
      ? await updateById("owners", existingOwner.id, patch)
      : existingOwner;

    return {
      id: resolvedOwner.id,
      ownerName: resolveOwnerName(resolvedOwner) || ownerInput.ownerName,
      phoneNumber: resolvedOwner.phoneNumber || ownerInput.phoneNumber || "",
      email: resolvedOwner.email || ownerInput.email || fallbackOwnerEmail(ownerInput),
    };
  }

  const createdOwner = await insert("owners", {
    fullName: ownerInput.ownerName || "Owner",
    ownerName: ownerInput.ownerName || "Owner",
    phoneNumber: ownerInput.phoneNumber || "",
    email: ownerInput.email || fallbackOwnerEmail(ownerInput),
  });

  return {
    id: createdOwner.id,
    ownerName: resolveOwnerName(createdOwner),
    phoneNumber: createdOwner.phoneNumber || "",
    email: createdOwner.email || fallbackOwnerEmail(createdOwner),
  };
}

export async function createPartnershipRequest(req, res) {
  // Payload owner/partner dạng lồng được làm phẳng để dữ liệu lưu dễ query hơn.
  const owner = req.body?.owner || {};
  const partner = req.body?.partner || {};
  const resolvedOwner = await ensureOwnerForRequest(req.body || {});
  const createdRequest = await insert("partnershipRequests", {
    ...req.body,
    ownerId: resolvedOwner.id || req.body?.ownerId || owner.id || "",
    ownerName:
      resolvedOwner.ownerName || req.body?.ownerName || owner.ownerName || owner.fullName || "",
    ownerPhoneNumber: resolvedOwner.phoneNumber || req.body?.ownerPhoneNumber || owner.phoneNumber || "",
    ownerEmail: resolvedOwner.email || req.body?.ownerEmail || owner.email || "",
    branchName: req.body?.branchName || partner.branchName || "",
    address: req.body?.address || partner.address || "",
    phoneNumber: req.body?.phoneNumber || partner.phoneNumber || "",
    status: normalizePartnershipRequestStatus(req.body?.status || "sent"),
  });

  return created(res, serializePartnershipRequest(createdRequest), "Partnership request created");
}

export async function getAllPartnershipRequests(_req, res) {
  const [requests, branches] = await Promise.all([
    list("partnershipRequests"),
    list("branches"),
  ]);

  const rows = requests.map((request) => {
    const branch = branches.find(
      (branchItem) =>
        branchItem.id === request?.branchId ||
        branchItem.partnershipRequestId === request?.id,
    );
    return serializePartnershipRequest(request, { branch });
  });

  return ok(res, rows);
}

export async function updatePartnershipRequestStatus(req, res) {
  const { requestId } = req.params;
  const status = req.body?.status || req.body?.value || req.body?.newStatus;

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  const updated = await updateById("partnershipRequests", requestId, {
    status: normalizePartnershipRequestStatus(status),
  });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Partnership request not found" });
  }

  return ok(res, serializePartnershipRequest(updated), "Partnership status updated");
}
