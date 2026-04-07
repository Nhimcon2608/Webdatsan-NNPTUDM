// Route reservation detail để lấy các slot đã đặt theo sân và reservation.
import { Router } from "../utils/router.js";

import {
  createReservationDetail,
  getReservationDetails,
} from "../controllers/reservationDetailController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getReservationDetails);
router.post("/", requireAuth, createReservationDetail);

export default router;
