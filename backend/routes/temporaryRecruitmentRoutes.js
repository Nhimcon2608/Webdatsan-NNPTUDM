// Route cho các bài temporary recruitment gắn với reservation.
import { Router } from "../utils/router.js";

import {
  createTemporaryRecruitment,
  getAllTemporaryRecruitments,
  getTemporaryRecruitmentById,
  updateTemporaryRecruitment,
} from "../controllers/temporaryRecruitmentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllTemporaryRecruitments);
router.post("/", requireAuth, createTemporaryRecruitment);
router.get("/:id", getTemporaryRecruitmentById);
router.patch("/:id", requireAuth, updateTemporaryRecruitment);

export default router;
