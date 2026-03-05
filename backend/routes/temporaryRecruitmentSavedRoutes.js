import { Router } from "express";

import {
  getSavedTemporaryRecruitments,
  saveTemporaryRecruitment,
  unsaveTemporaryRecruitment,
} from "../controllers/temporaryRecruitmentSavedController.js";

const router = Router();

router.get("/", getSavedTemporaryRecruitments);
router.post("/", saveTemporaryRecruitment);
router.delete("/:temporaryRecruitmentId", unsaveTemporaryRecruitment);

export default router;
