import { Router } from "../utils/router.js";

import { getPlayerByAccountId, updatePlayer } from "../controllers/playerController.js";

const router = Router();

router.get("/account/:accountId", getPlayerByAccountId);
router.put("/", updatePlayer);

export default router;
