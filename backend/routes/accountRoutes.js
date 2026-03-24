import { Router } from "../utils/router.js";
import multer from "multer";

import {
  changePassword,
  getAllAccounts,
  getMe,
  updatePhone,
  uploadImage,
} from "../controllers/accountController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllAccounts);
router.patch("/change-password", changePassword);
router.get("/me", getMe);
router.put("/me/phone", updatePhone);
router.put("/upload-image", upload.any(), uploadImage);

export default router;
