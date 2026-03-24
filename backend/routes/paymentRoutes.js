import { Router } from "../utils/router.js";

import {
  createMomoPayment,
  createPayment,
  getPaymentByReservationId,
  getPaymentsByBranch,
  getReservationIdsByOrderId,
  updatePaymentStatus,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/momo/create", createMomoPayment);
router.get("/momo/resIds-of/:orderId", getReservationIdsByOrderId);

router.post("/", createPayment);
router.get("/branch/:branchId", getPaymentsByBranch);
router.get("/reservation/:reservationId", getPaymentByReservationId);
router.put("/:invoiceId/status", updatePaymentStatus);

export default router;
