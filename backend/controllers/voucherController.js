import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export async function getVouchers(req, res) {
  const { branchId } = req.query;
  let rows = await list("vouchers");

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  return ok(res, rows);
}

export async function createVoucher(req, res) {
  const createdRow = await insert("vouchers", {
    ...req.body,
    status: req.body?.status || "ACTIVE",
  });
  return created(res, createdRow, "Voucher created");
}

export async function updateVoucher(req, res) {
  const { voucherId } = req.params;
  const payload = { ...(req.body || {}) };
  if (payload.status) {
    payload.status = String(payload.status).toUpperCase();
  }

  const updated = await updateById("vouchers", voucherId, payload);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Voucher not found" });
  }

  return ok(res, updated, "Voucher updated");
}
