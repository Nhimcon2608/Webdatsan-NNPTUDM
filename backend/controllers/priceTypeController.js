import { created, ok } from "../utils/response.js";
import { findById, insert, list, removeById } from "../utils/store.js";

export function getAllPriceTypes(_req, res) {
  return ok(res, list("priceTypes"));
}

export function getPriceTypeById(req, res) {
  const row = findById("priceTypes", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Price type not found" });
  }
  return ok(res, row);
}

export function createPriceType(req, res) {
  const createdRow = insert("priceTypes", req.body || {});
  return created(res, createdRow, "Price type created");
}

export function deletePriceType(req, res) {
  const deleted = removeById("priceTypes", req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Price type not found" });
  }
  return ok(res, deleted, "Price type deleted");
}
