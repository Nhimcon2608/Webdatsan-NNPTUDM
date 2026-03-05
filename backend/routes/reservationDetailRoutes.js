import { Router } from "express";

import {
  createReservationDetail,
  getTodaySlotsByCourt,
} from "../controllers/reservationDetailController.js";

const router = Router();

router.post("/", createReservationDetail);
router.get("/court/:courtId/today", getTodaySlotsByCourt);

export default router;
