// Route voucher để đọc và quản lý mã khuyến mãi theo branch.
import { Router } from "../utils/router.js";

import {
  createVoucher,
  getVouchers,
  updateVoucher,
} from "../controllers/voucherController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

// Các thao tác ghi voucher chỉ dành cho role nhân sự.
router.get("/", getVouchers);
router.post("/", requireRoles("ADMIN", "MANAGER"), createVoucher);
router.patch("/:voucherId", requireRoles("ADMIN", "MANAGER"), updateVoucher);

export default router;
