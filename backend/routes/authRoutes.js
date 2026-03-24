import { Router } from "../utils/router.js";

import { login, logout, register } from "../controllers/authController.js";

const router = Router();

router.post("/", login);
router.delete("/current", logout);

export default router;
