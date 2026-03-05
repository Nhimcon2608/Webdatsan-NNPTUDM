import { Router } from "express";

import {
  cancelReservation,
  createReservation,
  getAllReservations,
  getAllReservationsByBranch,
  getLatestReservations,
  getReservationById,
  getReservationsByBranch,
  getReservationsByBranchAndDate,
  getReservationsByUserStatus,
  scheduleCancellationBulk,
  scheduleCancellationById,
  sendReservationNotification,
  updateReservation,
  updateReservationStatus,
} from "../controllers/reservationController.js";

const router = Router();

router.get("/latest", getLatestReservations);
router.get("/notification/:reservationId", sendReservationNotification);
router.get("/branch/:branchId/all", getAllReservationsByBranch);
router.get("/branch/:branchId/:date", getReservationsByBranchAndDate);
router.get("/branch/:branchId", getReservationsByBranch);
router.get("/user/:status", getReservationsByUserStatus);
router.get("/:reservationId", getReservationById);
router.get("/", getAllReservations);

router.post("/", createReservation);

router.put("/cancel/:reservationId", cancelReservation);
router.put("/:reservationId/status", updateReservationStatus);
router.put("/:reservationId", updateReservation);

router.patch("/schedule-cancel/:reservationId", scheduleCancellationById);
router.patch("/schedule-cancel", scheduleCancellationBulk);

export default router;
