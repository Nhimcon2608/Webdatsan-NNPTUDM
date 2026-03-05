import { Router } from "express";

import {
  createFixedBooking,
  updateFixedBookingStatus,
} from "../controllers/fixedBookingController.js";

const router = Router();

router.post("/", createFixedBooking);
router.patch("/", updateFixedBookingStatus);

export default router;
