import { Router } from "../utils/router.js";

import {
  createReservation,
  createReservationNotification,
  getReservations,
  getReservationById,
  updateReservation,
} from "../controllers/reservationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getReservations);
router.post("/", requireAuth, createReservation);
router.get("/:reservationId", getReservationById);
router.patch("/:reservationId", requireAuth, updateReservation);
router.post("/:reservationId/notifications", requireAuth, createReservationNotification);

export default router;
