// Route tạo và quản lý nhóm reservation lặp lại.
import { Router } from "../utils/router.js";

import {
  createFixedBooking,
  getFixedBookings,
  updateFixedBooking,
} from "../controllers/fixedBookingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Fixed booking là hành động gắn với user nên mọi thao tác ghi đều cần đăng nhập.
router.get("/", getFixedBookings);
router.post("/", requireAuth, createFixedBooking);
router.patch("/:fixedBookingId", requireAuth, updateFixedBooking);

export default router;
