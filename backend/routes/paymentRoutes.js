import { Router } from "../utils/router.js";

import {
  createPayment,
  getPayments,
  updatePayment,
} from "../controllers/paymentController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getPayments);
router.post("/", requireRoles("ADMIN", "MANAGER"), createPayment);
router.patch("/:paymentId", requireRoles("ADMIN", "MANAGER"), updatePayment);

export default router;
