import { Router } from "../utils/router.js";

import {
  createCourt,
  getCourts,
  updateCourt,
} from "../controllers/badmintonCourtController.js";

const router = Router();

router.get("/", getCourts);
router.post("/", createCourt);
router.patch("/:courtId", updateCourt);

export default router;
