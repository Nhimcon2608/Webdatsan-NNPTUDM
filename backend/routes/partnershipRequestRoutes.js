import { Router } from "express";

import {
  createPartnershipRequest,
  getAllPartnershipRequests,
  updatePartnershipRequestStatus,
} from "../controllers/partnershipRequestController.js";

const router = Router();

router.post("/", createPartnershipRequest);
router.get("/", getAllPartnershipRequests);
router.patch("/:requestId/status", updatePartnershipRequestStatus);

export default router;
