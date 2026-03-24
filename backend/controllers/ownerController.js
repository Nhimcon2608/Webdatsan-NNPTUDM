import { ok } from "../utils/response.js";
import { list } from "../utils/store.js";
import { serializeOwner } from "../utils/partnershipRequestView.js";

export async function getAllOwners(_req, res) {
  const [owners, requests, branches] = await Promise.all([
    list("owners"),
    list("partnershipRequests"),
    list("branches"),
  ]);

  return ok(res, owners.map((owner) => serializeOwner(owner, requests, branches)));
}

export async function getOwnerByPhoneNumber(req, res) {
  const { phoneNumber } = req.params;
  const [owners, requests, branches] = await Promise.all([
    list("owners"),
    list("partnershipRequests"),
    list("branches"),
  ]);
  const owner = owners.find((item) => item.phoneNumber === phoneNumber);

  if (!owner) {
    return res.status(404).json({ success: false, message: "Owner not found" });
  }

  return ok(res, serializeOwner(owner, requests, branches));
}
