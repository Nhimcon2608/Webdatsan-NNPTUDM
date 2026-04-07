// Đọc và ghi review của người dùng cho branch.
import { created, ok } from "../utils/response.js";
import { getRequestAccount } from "../middleware/auth.js";
import { insert, list, updateById } from "../utils/store.js";

export async function getReviews(req, res) {
  const { branchId, scope } = req.query;
  let rows = await list("reviews");

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (scope === "current") {
    const account = await getRequestAccount(req);

    if (!account) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    rows = rows.filter((item) => item.accountId === req.context.accountId);
  }

  return ok(res, rows);
}

export async function createReview(req, res) {
  const createdRow = await insert("reviews", {
    ...req.body,
    accountId: req.body?.accountId || req.context.accountId,
  });

  return created(res, createdRow, "Review created");
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const updated = await updateById("reviews", id, req.body || {});

  if (!updated) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  return ok(res, updated, "Review updated");
}
