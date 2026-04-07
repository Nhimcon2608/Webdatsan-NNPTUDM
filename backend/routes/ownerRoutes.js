// Route owner dạng chỉ đọc để xem thông tin chủ sân và yêu cầu liên quan.
import { Router } from "../utils/router.js";

import { getOwners } from "../controllers/ownerController.js";

const router = Router();

router.get("/", getOwners);

export default router;
