import { Router } from "../utils/router.js";

import { createPaymentLink } from "../controllers/paymentController.js";

const router = Router();

router.post("/", createPaymentLink);

export default router;
