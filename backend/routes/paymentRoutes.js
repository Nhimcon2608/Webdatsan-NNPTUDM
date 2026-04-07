// Route payment gồm bản ghi hóa đơn và callback từ nhà cung cấp thanh toán.
import { Router } from "../utils/router.js";

import {
  createPayment,
  getPayments,
  handleMomoIpn,
  updatePayment,
} from "../controllers/paymentController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

// IPN callback phải public, còn thao tác của nhân sự thì cần role cao hơn.
router.post("/momo/ipn", handleMomoIpn);
router.get("/", getPayments);
router.post("/", requireRoles("ADMIN", "MANAGER"), createPayment);
router.patch("/:paymentId", requireRoles("ADMIN", "MANAGER"), updatePayment);

export default router;
