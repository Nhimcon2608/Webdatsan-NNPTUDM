import { Router } from "../utils/router.js";

import {
  createVoucher,
  getVouchers,
  updateVoucher,
} from "../controllers/voucherController.js";

const router = Router();

router.get("/", getVouchers);
router.post("/", createVoucher);
router.patch("/:voucherId", updateVoucher);

export default router;
