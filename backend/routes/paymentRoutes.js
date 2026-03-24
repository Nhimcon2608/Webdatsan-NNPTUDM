import { Router } from "../utils/router.js";

import {
  createPayment,
  getPayments,
  updatePayment,
} from "../controllers/paymentController.js";

const router = Router();

router.get("/", getPayments);
router.post("/", createPayment);
router.patch("/:paymentId", updatePayment);

export default router;
