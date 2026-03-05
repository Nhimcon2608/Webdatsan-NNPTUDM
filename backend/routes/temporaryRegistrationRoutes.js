import { Router } from "express";

import {
  getTemporaryRegistrations,
  registerTemporaryRecruitment,
} from "../controllers/temporaryRegistrationController.js";

const router = Router();

router.get("/", getTemporaryRegistrations);
router.post("/", registerTemporaryRecruitment);

export default router;
