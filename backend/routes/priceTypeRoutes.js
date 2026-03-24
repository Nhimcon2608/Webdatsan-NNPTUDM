import { Router } from "../utils/router.js";

import {
  createPriceType,
  deletePriceType,
  getAllPriceTypes,
  getPriceTypeById,
} from "../controllers/priceTypeController.js";

const router = Router();

router.get("/", getAllPriceTypes);
router.post("/", createPriceType);
router.get("/:id", getPriceTypeById);
router.delete("/:id", deletePriceType);

export default router;
