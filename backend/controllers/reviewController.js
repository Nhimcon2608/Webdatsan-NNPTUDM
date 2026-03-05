import { created, ok } from "../utils/response.js";
import { insert, list, updateById } from "../utils/store.js";

export function getReviewsByBranch(req, res) {
  const { branchId } = req.params;
  const rows = list("reviews").filter((item) => item.branchId === branchId);
  return ok(res, rows);
}

export function getReviewsByUser(req, res) {
  const accountId = req.context.accountId;
  const rows = list("reviews").filter((item) => item.accountId === accountId);
  return ok(res, rows);
}

export function createReview(req, res) {
  const createdRow = insert("reviews", {
    ...req.body,
    accountId: req.body?.accountId || req.context.accountId,
  });

  return created(res, createdRow, "Review created");
}

export function updateReview(req, res) {
  const { id } = req.params;
  const updated = updateById("reviews", id, req.body || {});

  if (!updated) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  return ok(res, updated, "Review updated");
}
