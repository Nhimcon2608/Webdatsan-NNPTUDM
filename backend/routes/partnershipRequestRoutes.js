// Route gửi và duyệt partnership request.
import { Router } from "../utils/router.js";

import {
  createPartnershipRequest,
  getAllPartnershipRequests,
  updatePartnershipRequestStatus,
} from "../controllers/partnershipRequestController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

// Ai cũng có thể gửi request, nhưng chỉ admin mới được duyệt hàng chờ.
router.post("/", createPartnershipRequest);
router.get("/", requireRoles("ADMIN"), getAllPartnershipRequests);
router.patch("/:requestId/status", requireRoles("ADMIN"), updatePartnershipRequestStatus);

export default router;
