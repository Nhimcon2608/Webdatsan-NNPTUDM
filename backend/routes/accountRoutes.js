import { Router } from "../utils/router.js";
import multer from "multer";

import {
  changePassword,
  getAllAccounts,
  getMe,
  updateAccount,
  uploadImage,
} from "../controllers/accountController.js";
import { register } from "../controllers/authController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllAccounts);
router.post("/", register);
router.get("/current", getMe);
router.patch("/current", updateAccount);
router.patch("/current/password", changePassword);
router.put("/current/avatar", upload.single("file"), uploadImage);

export default router;
