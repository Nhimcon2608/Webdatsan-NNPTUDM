import { ok } from "../utils/response.js";
import { list } from "../utils/store.js";

export function getAllOwners(_req, res) {
  return ok(res, list("owners"));
}

export function getOwnerByPhoneNumber(req, res) {
  const { phoneNumber } = req.params;
  const owner = list("owners").find((item) => item.phoneNumber === phoneNumber);

  if (!owner) {
    return res.status(404).json({ success: false, message: "Owner not found" });
  }

  return ok(res, owner);
}
