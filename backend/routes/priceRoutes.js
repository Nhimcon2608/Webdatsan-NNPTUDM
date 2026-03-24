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

const router = Router();

router.get("/", getAllPrices);
router.post("/", createPrice);
router.get("/:id", getPriceById);
router.patch("/:id", updatePrice);
router.delete("/:id", deletePrice);

export default router;
