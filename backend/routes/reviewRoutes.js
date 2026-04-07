// Route review cho phép tạo phản hồi và lấy danh sách review theo branch/user.
import { Router } from "../utils/router.js";

import {
  createReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getReviews);
router.post("/", requireAuth, createReview);
router.patch("/:id", requireAuth, updateReview);

export default router;
