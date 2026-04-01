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

router.get("/", getAllPrices);
router.post("/", requireRoles("ADMIN", "MANAGER"), createPrice);
router.get("/:id", getPriceById);
router.patch("/:id", requireRoles("ADMIN", "MANAGER"), updatePrice);
router.delete("/:id", requireRoles("ADMIN", "MANAGER"), deletePrice);

export default router;
