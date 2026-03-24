import { Router } from "../utils/router.js";

import { getCurrentPlayer, updateCurrentPlayer } from "../controllers/playerController.js";

const router = Router();

router.get("/current", getCurrentPlayer);
router.put("/current", updateCurrentPlayer);

export default router;
