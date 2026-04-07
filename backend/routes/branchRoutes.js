import { Router } from "../utils/router.js";
import multer from "multer";

import {
  createBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getBranches);
router.post("/", requireRoles("ADMIN"), createBranch);
router.get("/:branchId", getBranchById);
router.patch("/:branchId", requireRoles("ADMIN", "MANAGER"), upload.single("file"), updateBranch);

export default router;
