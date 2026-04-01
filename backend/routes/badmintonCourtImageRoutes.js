import { Router } from "../utils/router.js";
import multer from "multer";

import {
  deleteCourtImage,
  uploadCourtImage,
} from "../controllers/badmintonCourtImageController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/:badmintonCourtId/images",
  requireRoles("ADMIN", "MANAGER"),
  upload.single("file"),
  uploadCourtImage,
);
router.delete(
  "/:badmintonCourtId/images/:imageId",
  requireRoles("ADMIN", "MANAGER"),
  deleteCourtImage,
);

export default router;
