import { Router } from "../utils/router.js";

import {
  createFixedBooking,
  getFixedBookings,
  updateFixedBooking,
} from "../controllers/fixedBookingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getFixedBookings);
router.post("/", requireAuth, createFixedBooking);
router.patch("/:fixedBookingId", requireAuth, updateFixedBooking);

export default router;
