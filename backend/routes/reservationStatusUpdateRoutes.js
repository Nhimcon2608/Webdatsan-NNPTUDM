import { Router } from "../utils/router.js";

import { bulkUpdateReservations } from "../controllers/reservationController.js";

const router = Router();

router.post("/", bulkUpdateReservations);

export default router;
