import { Router } from "express";

import {
  createVoucher,
  getVouchersByBranch,
  toggleVoucher,
  updateVoucher,
} from "../controllers/voucherController.js";

const router = Router();

router.get("/branch/:branchId", getVouchersByBranch);
router.post("/", createVoucher);
router.put("/:voucherId", updateVoucher);
router.patch("/enable", toggleVoucher);

export default router;
