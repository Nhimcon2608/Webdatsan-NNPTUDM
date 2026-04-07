// User đã đăng nhập có thể tạo link thanh toán từ các reservation id của mình.
import { Router } from "../utils/router.js";

import { createPaymentLink } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createPaymentLink);

export default router;
