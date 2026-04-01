import { Router } from "../utils/router.js";

import {
  createBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getBranches);
router.post("/", requireRoles("ADMIN"), createBranch);
router.get("/:branchId", getBranchById);
router.patch("/:branchId", requireRoles("ADMIN", "MANAGER"), updateBranch);

export default router;
