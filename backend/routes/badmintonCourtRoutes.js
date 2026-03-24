import { Router } from "../utils/router.js";

import {
  createCourt,
  getCourtsByBranch,
  getCourtsByBranchAndStatus,
  getCourtsByManager,
  toggleCourtStatus,
} from "../controllers/badmintonCourtController.js";

const router = Router();

router.get("/branch/:branchId/:status", getCourtsByBranchAndStatus);
router.get("/branch/:branchId", getCourtsByBranch);
router.get("/manager/:accountId", getCourtsByManager);
router.patch("/:courtId/toggle", toggleCourtStatus);
router.post("/", createCourt);

export default router;
