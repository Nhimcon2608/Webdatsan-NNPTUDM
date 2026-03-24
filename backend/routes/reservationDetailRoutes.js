import { Router } from "../utils/router.js";

import {
  createReservationDetail,
  getReservationDetails,
} from "../controllers/reservationDetailController.js";

const router = Router();

router.get("/", getReservationDetails);
router.post("/", createReservationDetail);

export default router;
