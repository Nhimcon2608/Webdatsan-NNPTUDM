import { Router } from "../utils/router.js";

import {
  createReservation,
  createReservationNotification,
  getReservations,
  getReservationById,
  updateReservation,
} from "../controllers/reservationController.js";

const router = Router();

router.get("/", getReservations);
router.post("/", createReservation);
router.get("/:reservationId", getReservationById);
router.patch("/:reservationId", updateReservation);
router.post("/:reservationId/notifications", createReservationNotification);

export default router;
