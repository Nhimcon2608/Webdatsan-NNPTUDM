import { created, ok } from "../utils/response.js";
import { findById, insert, list, removeById } from "../utils/store.js";

export async function getAllPriceTypes(_req, res) {
  return ok(res, await list("priceTypes"));
}

export async function getPriceTypeById(req, res) {
  const row = await findById("priceTypes", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Price type not found" });
  }
  return ok(res, row);
}

export async function createPriceType(req, res) {
  const createdRow = await insert("priceTypes", req.body || {});
  return created(res, createdRow, "Price type created");
}

export async function deletePriceType(req, res) {
  const deleted = await removeById("priceTypes", req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Price type not found" });
  }
  return ok(res, deleted, "Price type deleted");
}
