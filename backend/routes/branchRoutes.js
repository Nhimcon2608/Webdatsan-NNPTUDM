import { Router } from "../utils/router.js";

import {
  createBranch,
  getBranchById,
  getBranchByManager,
  getBranchByPartnershipRequest,
  getBranchesByCooperated,
  updateBranch,
  updateBranchStatus,
} from "../controllers/branchController.js";

const router = Router();

router.get("/is-cooperated/:isCooperated", getBranchesByCooperated);
router.get("/request/:requestId", getBranchByPartnershipRequest);
router.get("/manager/:accountId", getBranchByManager);
router.get("/:branchId", getBranchById);
router.post("/", createBranch);
router.put("/:branchId/status", updateBranchStatus);
router.put("/:branchId/update", updateBranch);

export default router;
