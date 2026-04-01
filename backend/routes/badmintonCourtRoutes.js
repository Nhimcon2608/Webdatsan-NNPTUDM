import { Router } from "../utils/router.js";

import {
  createCourt,
  getCourts,
  updateCourt,
} from "../controllers/badmintonCourtController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getCourts);
router.post("/", requireRoles("ADMIN", "MANAGER"), createCourt);
router.patch("/:courtId", requireRoles("ADMIN", "MANAGER"), updateCourt);

export default router;
