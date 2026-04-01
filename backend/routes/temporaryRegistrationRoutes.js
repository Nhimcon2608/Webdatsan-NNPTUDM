import { Router } from "../utils/router.js";

import {
  getTemporaryRegistrations,
  registerTemporaryRecruitment,
} from "../controllers/temporaryRegistrationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getTemporaryRegistrations);
router.post("/", requireAuth, registerTemporaryRecruitment);

export default router;
