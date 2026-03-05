import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export function createPartnershipRequest(req, res) {
  const createdRequest = insert("partnershipRequests", {
    ...req.body,
    status: req.body?.status || "PENDING",
  });

  return created(res, createdRequest, "Partnership request created");
}

export function getAllPartnershipRequests(_req, res) {
  return ok(res, list("partnershipRequests"));
}

export function updatePartnershipRequestStatus(req, res) {
  const { requestId } = req.params;
  const status = req.body?.status || req.body?.value || req.body?.newStatus;

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  const updated = updateById("partnershipRequests", requestId, { status });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Partnership request not found" });
  }

  return ok(res, updated, "Partnership status updated");
}
