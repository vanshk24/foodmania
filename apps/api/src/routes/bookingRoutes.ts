import { Router } from "express";
import {
  postBooking,
  getBookings,
  patchBookingStatus,
} from "../controllers/bookingController.js";
import { optionalAuth, authenticateToken, requireRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(optionalAuth);

router.post("/", postBooking);
router.get("/", getBookings);
router.patch("/:id", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), patchBookingStatus);

export default router;
