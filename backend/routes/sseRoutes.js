// Route SSE giữ kết nối realtime một chiều cho thông báo.
import { Router } from "../utils/router.js";

import { subscribe } from "../controllers/sseController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/stream", requireAuth, subscribe);

export default router;
