// Route branch cho danh sách, chi tiết, tạo mới và cập nhật dữ liệu branch.
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

// Cập nhật branch hỗ trợ multipart form data để manager đổi ảnh branch.
router.get("/", getBranches);
router.post("/", requireRoles("ADMIN"), createBranch);
router.get("/:branchId", getBranchById);
router.patch("/:branchId", requireRoles("ADMIN", "MANAGER"), upload.single("file"), updateBranch);

export default router;
