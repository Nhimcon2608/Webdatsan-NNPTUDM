// Route lấy danh sách, tạo mới và cập nhật court thuộc một branch.
import { Router } from "../utils/router.js";

import {
  createCourt,
  getCourts,
  updateCourt,
} from "../controllers/badmintonCourtController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

// Đọc dữ liệu là public, còn ghi dữ liệu chỉ dành cho admin và manager.
router.get("/", getCourts);
router.post("/", requireRoles("ADMIN", "MANAGER"), createCourt);
router.patch("/:courtId", requireRoles("ADMIN", "MANAGER"), updateCourt);

export default router;
