import { Router } from "../utils/router.js";

import { subscribe } from "../controllers/sseController.js";

const router = Router();

router.get("/notifications", subscribe);

export default router;
