import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export function getVouchersByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("vouchers").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function createVoucher(req, res) {
  const createdRow = insert("vouchers", {
    ...req.body,
    status: req.body?.status || "ACTIVE",
  });
  return created(res, createdRow, "Voucher created");
}

export function updateVoucher(req, res) {
  const { voucherId } = req.params;
  const updated = updateById("vouchers", voucherId, req.body || {});

  if (!updated) {
    return res.status(404).json({ success: false, message: "Voucher not found" });
  }

  return ok(res, updated, "Voucher updated");
}

export function toggleVoucher(req, res) {
  const voucherId = req.query.voucherId;
  const status = req.query.status;

  if (!voucherId || !status) {
    return res.status(400).json({ success: false, message: "voucherId and status are required" });
  }

  const updated = updateById("vouchers", voucherId, { status: String(status).toUpperCase() });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Voucher not found" });
  }

  return ok(res, updated, "Voucher status updated");
}
