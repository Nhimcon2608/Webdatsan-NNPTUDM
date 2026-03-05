import { Router } from "express";

import { getPlayerByAccountId, updatePlayer } from "../controllers/playerController.js";

const router = Router();

router.get("/account/:accountId", getPlayerByAccountId);
router.put("/", updatePlayer);

export default router;
