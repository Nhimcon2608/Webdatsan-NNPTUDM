import { Router } from "../utils/router.js";

import {
  createFixedBooking,
  getFixedBookings,
  updateFixedBooking,
} from "../controllers/fixedBookingController.js";

const router = Router();

router.get("/", getFixedBookings);
router.post("/", createFixedBooking);
router.patch("/:fixedBookingId", updateFixedBooking);

export default router;
