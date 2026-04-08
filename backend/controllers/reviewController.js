// Đọc và ghi review của người dùng cho branch.
import { created, ok } from "../utils/response.js";
import { getRequestAccount } from "../middleware/auth.js";
import { insert, list, updateById } from "../utils/store.js";
import { buildReviewContext, serializeReview } from "../utils/reviewView.js";

async function loadReviewContext() {
  const [accounts, players] = await Promise.all([list("accounts"), list("players")]);

  return buildReviewContext(accounts, players);
}

function normalizeReviewPatch(payload = {}) {
  if (!Object.hasOwn(payload, "ratingLevel") && !Object.hasOwn(payload, "rating")) {
    return payload;
  }

  const normalizedRating = Number(payload.ratingLevel ?? payload.rating);

  return {
    ...payload,
    ratingLevel: Number.isFinite(normalizedRating) ? normalizedRating : 0,
    rating: Number.isFinite(normalizedRating) ? normalizedRating : 0,
  };
}

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

  const context = await loadReviewContext();
  return ok(res, rows.map((row) => serializeReview(row, context)));
}

export async function createReview(req, res) {
  const payload = normalizeReviewPatch(req.body || {});
  const createdRow = await insert("reviews", {
    ...payload,
    accountId: payload.accountId || req.context.accountId,
  });

  const context = await loadReviewContext();
  return created(res, serializeReview(createdRow, context), "Review created");
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const updated = await updateById("reviews", id, normalizeReviewPatch(req.body || {}));

  if (!updated) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  const context = await loadReviewContext();
  return ok(res, serializeReview(updated, context), "Review updated");
}
