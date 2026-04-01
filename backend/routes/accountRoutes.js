import { Router } from "../utils/router.js";
import multer from "multer";

import {
  changePassword,
  getAllAccounts,
  getMe,
  updateAccount,
  uploadImage,
} from "../controllers/accountController.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", requireRoles("ADMIN"), getAllAccounts);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateAccount);
router.put("/me/password", requireAuth, changePassword);
router.put("/me/avatar", requireAuth, upload.single("file"), uploadImage);

export default router;
