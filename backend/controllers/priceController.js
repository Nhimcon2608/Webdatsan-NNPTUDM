import { created, ok } from "../utils/response.js";
import { findById, insert, list, removeById, updateById } from "../utils/store.js";

export async function getAllPrices(req, res) {
  const { branchId, priceTypeId } = req.query;
  let rows = await list("prices");

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (priceTypeId) {
    rows = rows.filter((item) => item.priceTypeId === priceTypeId);
  }

  return ok(res, rows);
}

export async function getPriceById(req, res) {
  const row = await findById("prices", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, row);
}

export async function getPricesByBranch(req, res) {
  const { branchId } = req.params;
  const rows = (await list("prices")).filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export async function getAllPriceTypesByBranch(req, res) {
  const { branchId } = req.params;
  const prices = (await list("prices")).filter((item) => item.branchId === branchId);
  const allTypes = await list("priceTypes");

  const rows = allTypes.map((type) => ({
    ...type,
    prices: prices.filter((p) => p.priceTypeId === type.id),
  }));

  return ok(res, rows);
}

export async function getByBranchAndPriceType(req, res) {
  const { branchId, priceTypeId } = req.params;
  const rows = (await list("prices")).filter(
    (item) => item.branchId === branchId && item.priceTypeId === priceTypeId,
  );
  return ok(res, rows);
}

export async function createPrice(req, res) {
  const createdRow = await insert("prices", req.body || {});
  return created(res, createdRow, "Price created");
}

export async function updatePrice(req, res) {
  const updated = await updateById("prices", req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, updated, "Price updated");
}

export async function deletePrice(req, res) {
  const deleted = await removeById("prices", req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }
  return ok(res, deleted, "Price deleted");
}
