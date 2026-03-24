import { Router } from "../utils/router.js";

import {
  changeTemporaryRecruitmentStatus,
  createTemporaryRecruitment,
  getAllTemporaryRecruitments,
  getTemporaryRecruitmentById,
  getTemporaryRecruitmentByReservation,
  getTemporaryRecruitmentFullInfor,
  updateTemporaryRecruitment,
} from "../controllers/temporaryRecruitmentController.js";

const router = Router();

router.get("/full-infor/:id", getTemporaryRecruitmentFullInfor);
router.get("/by-reservation/:id", getTemporaryRecruitmentByReservation);
router.get("/:id", getTemporaryRecruitmentById);
router.get("/", getAllTemporaryRecruitments);
router.post("/", createTemporaryRecruitment);
router.patch("/:id", changeTemporaryRecruitmentStatus);
router.put("/:id", updateTemporaryRecruitment);

export default router;
