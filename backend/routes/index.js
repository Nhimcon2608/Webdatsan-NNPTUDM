import { Router } from "../utils/router.js";

import accountRoutes from "./accountRoutes.js";
import authRoutes from "./authRoutes.js";
import badmintonCourtImageRoutes from "./badmintonCourtImageRoutes.js";
import badmintonCourtRoutes from "./badmintonCourtRoutes.js";
import branchRoutes from "./branchRoutes.js";
import fixedBookingRoutes from "./fixedBookingRoutes.js";
import ownerRoutes from "./ownerRoutes.js";
import partnershipRequestRoutes from "./partnershipRequestRoutes.js";
import paymentLinkRoutes from "./paymentLinkRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import playerRoutes from "./playerRoutes.js";
import priceRoutes from "./priceRoutes.js";
import priceTypeRoutes from "./priceTypeRoutes.js";
import reservationDetailRoutes from "./reservationDetailRoutes.js";
import reservationStatusUpdateRoutes from "./reservationStatusUpdateRoutes.js";
import reservationRoutes from "./reservationRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import sseRoutes from "./sseRoutes.js";
import temporaryRecruitmentRoutes from "./temporaryRecruitmentRoutes.js";
import temporaryRecruitmentSavedRoutes from "./temporaryRecruitmentSavedRoutes.js";
import temporaryRegistrationRoutes from "./temporaryRegistrationRoutes.js";
import voucherRoutes from "./voucherRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", accountRoutes);
router.use("/owners", ownerRoutes);
router.use("/players", playerRoutes);

router.use("/partnership-requests", partnershipRequestRoutes);
router.use("/branches", branchRoutes);
router.use("/courts", badmintonCourtRoutes);
router.use("/courts", badmintonCourtImageRoutes);
router.use("/prices", priceRoutes);
router.use("/price-types", priceTypeRoutes);

router.use("/reservations", reservationRoutes);
router.use("/reservations/details", reservationDetailRoutes);
router.use("/reservations/status-updates", reservationStatusUpdateRoutes);
router.use("/reservations/fixed-bookings", fixedBookingRoutes);

router.use("/temporary-recruitments", temporaryRecruitmentRoutes);
router.use("/temporary-recruitments/saved", temporaryRecruitmentSavedRoutes);
router.use("/temporary-recruitments/registrations", temporaryRegistrationRoutes);

router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/payments/links", paymentLinkRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/notifications", sseRoutes);

export default router;
