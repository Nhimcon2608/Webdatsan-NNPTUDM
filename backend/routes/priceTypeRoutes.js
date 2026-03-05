import { Router } from "express";

import {
  createPriceType,
  deletePriceType,
  getAllPriceTypes,
  getPriceTypeById,
} from "../controllers/priceTypeController.js";

const router = Router();

router.get("/", getAllPriceTypes);
router.get("/:id", getPriceTypeById);
router.post("/", createPriceType);
router.delete("/:id", deletePriceType);

export default router;
