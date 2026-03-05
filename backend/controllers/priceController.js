import { created, ok } from "../utils/response.js";
import { findById, insert, list, removeById, updateById } from "../utils/store.js";

export function getAllPrices(_req, res) {
  return ok(res, list("prices"));
}

export function getPriceById(req, res) {
  const row = findById("prices", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, row);
}

export function getPricesByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("prices").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function getAllPriceTypesByBranch(req, res) {
  const { branchId } = req.params;
  const prices = list("prices").filter((item) => item.branchId === branchId);
  const allTypes = list("priceTypes");

  const rows = allTypes.map((type) => ({
    ...type,
    prices: prices.filter((p) => p.priceTypeId === type.id),
  }));

  return ok(res, rows);
}

export function getByBranchAndPriceType(req, res) {
  const { branchId, priceTypeId } = req.params;
  const rows = list("prices").filter(
    (item) => item.branchId === branchId && item.priceTypeId === priceTypeId,
  );
  return ok(res, rows);
}

export function createPrice(req, res) {
  const createdRow = insert("prices", req.body || {});
  return created(res, createdRow, "Price created");
}

export function updatePrice(req, res) {
  const updated = updateById("prices", req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, updated, "Price updated");
}

export function deletePrice(req, res) {
  const deleted = removeById("prices", req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, deleted, "Price deleted");
}
