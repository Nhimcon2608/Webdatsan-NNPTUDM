import { Router } from "../utils/router.js";

import {
  createVoucher,
  getVouchers,
  updateVoucher,
} from "../controllers/voucherController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getVouchers);
router.post("/", requireRoles("ADMIN", "MANAGER"), createVoucher);
router.patch("/:voucherId", requireRoles("ADMIN", "MANAGER"), updateVoucher);

export default router;
