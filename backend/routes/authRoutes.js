import { Router } from "../utils/router.js";

import { login, logout, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", requireAuth, logout);

export default router;
