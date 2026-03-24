import { Router } from "../utils/router.js";

import { subscribe } from "../controllers/sseController.js";

const router = Router();

router.get("/subscribe/:userId", subscribe);

export default router;
