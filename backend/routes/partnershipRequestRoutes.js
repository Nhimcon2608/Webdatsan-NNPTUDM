import { Router } from "../utils/router.js";

import {
  createPartnershipRequest,
  getAllPartnershipRequests,
  updatePartnershipRequestStatus,
} from "../controllers/partnershipRequestController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();

router.post("/", createPartnershipRequest);
router.get("/", requireRoles("ADMIN"), getAllPartnershipRequests);
router.patch("/:requestId/status", requireRoles("ADMIN"), updatePartnershipRequestStatus);

export default router;
