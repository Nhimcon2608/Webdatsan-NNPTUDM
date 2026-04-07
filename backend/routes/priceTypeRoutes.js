// Route cho các định nghĩa price type dùng lại như thường hoặc VIP.
import { Router } from "../utils/router.js";

import {
  createPriceType,
  deletePriceType,
  getAllPriceTypes,
  getPriceTypeById,
} from "../controllers/priceTypeController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllPriceTypes);
router.post("/", requireRoles("ADMIN"), createPriceType);
router.get("/:id", getPriceTypeById);
router.delete("/:id", requireRoles("ADMIN"), deletePriceType);

export default router;
