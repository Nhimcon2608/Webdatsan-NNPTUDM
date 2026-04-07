// Route chuyên để cập nhật trạng thái reservation hàng loạt.
import { Router } from "../utils/router.js";

import { bulkUpdateReservations } from "../controllers/reservationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/", requireAuth, bulkUpdateReservations);

export default router;
