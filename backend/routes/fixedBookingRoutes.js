import { Router } from "../utils/router.js";

import {
  createFixedBooking,
  updateFixedBookingStatus,
} from "../controllers/fixedBookingController.js";

const router = Router();

router.post("/", createFixedBooking);
router.patch("/", updateFixedBookingStatus);

export default router;
