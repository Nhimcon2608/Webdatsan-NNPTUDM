// Route price dùng để quản lý dữ liệu giá theo branch.
import { Router } from "../utils/router.js";

import {
  createPrice,
  deletePrice,
  getAllPriceTypesByBranch,
  getAllPrices,
  getByBranchAndPriceType,
  getPriceById,
  getPricesByBranch,
  updatePrice,
} from "../controllers/priceController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

// Đọc dữ liệu là public, còn ghi dữ liệu chỉ dành cho admin và manager.
router.get("/", getAllPrices);
router.post("/", requireRoles("ADMIN", "MANAGER"), createPrice);
router.get("/:id", getPriceById);
router.patch("/:id", requireRoles("ADMIN", "MANAGER"), updatePrice);
router.delete("/:id", requireRoles("ADMIN", "MANAGER"), deletePrice);

export default router;
