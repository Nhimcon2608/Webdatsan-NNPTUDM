import { Router } from "../utils/router.js";

import {
  getSavedTemporaryRecruitments,
  saveTemporaryRecruitment,
  unsaveTemporaryRecruitment,
} from "../controllers/temporaryRecruitmentSavedController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getSavedTemporaryRecruitments);
router.post("/", requireAuth, saveTemporaryRecruitment);
router.delete("/:temporaryRecruitmentId", requireAuth, unsaveTemporaryRecruitment);

export default router;
