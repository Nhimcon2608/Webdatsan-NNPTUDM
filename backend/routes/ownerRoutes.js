import { Router } from "../utils/router.js";

import { getOwners } from "../controllers/ownerController.js";

const router = Router();

router.get("/", getOwners);

export default router;
