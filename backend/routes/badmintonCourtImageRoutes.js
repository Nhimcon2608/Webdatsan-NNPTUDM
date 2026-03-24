import { Router } from "../utils/router.js";
import multer from "multer";

import {
  deleteCourtImage,
  uploadCourtImage,
} from "../controllers/badmintonCourtImageController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:badmintonCourtId/images", upload.single("file"), uploadCourtImage);
router.delete("/:badmintonCourtId/images/:imageId", deleteCourtImage);

export default router;
