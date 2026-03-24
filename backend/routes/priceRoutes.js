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

router.get("/branch/:branchId/all-types", getAllPriceTypesByBranch);
router.get("/branch/:branchId/price-type/:priceTypeId", getByBranchAndPriceType);
router.get("/branch/:branchId", getPricesByBranch);
router.get("/", getAllPrices);
router.get("/:id", getPriceById);
router.post("/", createPrice);
router.put("/:id", updatePrice);
router.delete("/:id", deletePrice);

export default router;
