// Route account cho profile, mật khẩu, avatar và danh sách account của admin.
import { Router } from "../utils/router.js";
import multer from "multer";

import {
  adminResetPassword,
  changePassword,
  getAllAccounts,
  getMe,
  updateAccount,
  uploadImage,
} from "../controllers/accountController.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Admin xem toàn bộ account, còn user đã đăng nhập quản lý hồ sơ của chính mình.
router.get("/", requireRoles("ADMIN"), getAllAccounts);
router.post("/:accountId/reset-password", requireRoles("ADMIN"), adminResetPassword);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateAccount);
router.put("/me/password", requireAuth, changePassword);
router.put("/me/avatar", requireAuth, upload.single("file"), uploadImage);

export default router;
