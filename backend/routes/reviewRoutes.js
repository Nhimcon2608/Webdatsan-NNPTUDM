import { Router } from "../utils/router.js";

import {
  createReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", getReviews);
router.post("/", createReview);
router.patch("/:id", updateReview);

export default router;
