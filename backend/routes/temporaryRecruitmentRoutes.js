import { Router } from "../utils/router.js";

import {
  createTemporaryRecruitment,
  getAllTemporaryRecruitments,
  getTemporaryRecruitmentById,
  updateTemporaryRecruitment,
} from "../controllers/temporaryRecruitmentController.js";

const router = Router();

router.get("/", getAllTemporaryRecruitments);
router.post("/", createTemporaryRecruitment);
router.get("/:id", getTemporaryRecruitmentById);
router.patch("/:id", updateTemporaryRecruitment);

export default router;
