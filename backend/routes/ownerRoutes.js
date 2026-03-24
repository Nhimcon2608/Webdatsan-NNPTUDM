import { Router } from "../utils/router.js";

import { getAllOwners, getOwnerByPhoneNumber } from "../controllers/ownerController.js";

const router = Router();

router.get("/phone/:phoneNumber", getOwnerByPhoneNumber);
router.get("/", getAllOwners);

export default router;
