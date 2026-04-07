// Xử lý gửi partnership request và luồng admin duyệt.
import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";
import {
  normalizePartnershipRequestStatus,
  serializePartnershipRequest,
} from "../utils/partnershipRequestView.js";

export async function createPartnershipRequest(req, res) {
  // Payload owner/partner dạng lồng được làm phẳng để dữ liệu lưu dễ query hơn.
  const owner = req.body?.owner || {};
  const partner = req.body?.partner || {};
  const createdRequest = await insert("partnershipRequests", {
    ...req.body,
    ownerId: req.body?.ownerId || owner.id || "",
    ownerName: req.body?.ownerName || owner.ownerName || owner.fullName || "",
    ownerPhoneNumber: req.body?.ownerPhoneNumber || owner.phoneNumber || "",
    ownerEmail: req.body?.ownerEmail || owner.email || "",
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
