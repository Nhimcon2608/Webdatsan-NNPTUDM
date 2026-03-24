import { Router } from "../utils/router.js";

import {
  createReview,
  getReviewsByBranch,
  getReviewsByUser,
  updateReview,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/branch/:branchId", getReviewsByBranch);
router.get("/user", getReviewsByUser);
router.post("/", createReview);
router.put("/:id", updateReview);

export default router;
