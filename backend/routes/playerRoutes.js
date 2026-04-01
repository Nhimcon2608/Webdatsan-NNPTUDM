import { Router } from "../utils/router.js";

import { getCurrentPlayer, updateCurrentPlayer } from "../controllers/playerController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getCurrentPlayer);
router.put("/me", requireAuth, updateCurrentPlayer);

export default router;
