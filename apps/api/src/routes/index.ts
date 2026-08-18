import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import restaurantRoutes from "./restaurantRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import orderRoutes from "./orderRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/bookings", bookingRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/notifications", notificationRoutes);
router.use("/payments", paymentRoutes);

export default router;
