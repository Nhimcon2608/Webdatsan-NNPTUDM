// Trả dữ liệu owner và có thể làm giàu thêm bằng branch cùng partnership request.
import { ok } from "../utils/response.js";
import { list } from "../utils/store.js";
import {
  mergeOwnersWithRequests,
  serializeOwner,
} from "../utils/partnershipRequestView.js";

function toTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getOwnerSortTimestamp(owner) {
  return toTimestamp(
    owner?.partnershipRequest?.[0]?.createAt ||
      owner?.updatedAt ||
      owner?.createdAt,
  );
}

export async function getOwners(req, res) {
  const [owners, requests, branches] = await Promise.all([
    list("owners"),
    list("partnershipRequests"),
    list("branches"),
  ]);
  const ownerRows = mergeOwnersWithRequests(owners, requests);

  if (req.query.phoneNumber) {
    const owner = ownerRows.find((item) => item.phoneNumber === req.query.phoneNumber);
    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }
    return ok(res, serializeOwner(owner, requests, branches));
  }

  const serializedOwners = ownerRows
    .map((owner) => serializeOwner(owner, requests, branches))
    .sort((left, right) => getOwnerSortTimestamp(right) - getOwnerSortTimestamp(left));

  return ok(res, serializedOwners);
}
