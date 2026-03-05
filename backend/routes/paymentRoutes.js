import { Router } from "express";

import {
  createMomoPayment,
  createPayment,
  getPaymentsByBranch,
  getReservationIdsByOrderId,
  updatePaymentStatus,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/momo/create", createMomoPayment);
router.get("/momo/resIds-of/:orderId", getReservationIdsByOrderId);

router.post("/", createPayment);
router.get("/branch/:branchId", getPaymentsByBranch);
router.put("/:invoiceId/status", updatePaymentStatus);

export default router;
