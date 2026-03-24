import { Router } from "../utils/router.js";

import {
  createBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";

const router = Router();

router.get("/", getBranches);
router.post("/", createBranch);
router.get("/:branchId", getBranchById);
router.patch("/:branchId", updateBranch);

export default router;
