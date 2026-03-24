import { ok } from "../utils/response.js";
import { list } from "../utils/store.js";
import { serializeOwner } from "../utils/partnershipRequestView.js";

export async function getOwners(req, res) {
  const [owners, requests, branches] = await Promise.all([
    list("owners"),
    list("partnershipRequests"),
    list("branches"),
  ]);

  if (req.query.phoneNumber) {
    const owner = owners.find((item) => item.phoneNumber === req.query.phoneNumber);
    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }
    return ok(res, serializeOwner(owner, requests, branches));
  }

  return ok(res, owners.map((owner) => serializeOwner(owner, requests, branches)));
}
