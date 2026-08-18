import { Router } from "express";
import {
  postOrder,
  getOrders,
  getOrderById,
  patchOrderStatus,
} from "../controllers/orderController.js";
import { optionalAuth, authenticateToken, requireRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(optionalAuth);

router.post("/", postOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), patchOrderStatus);

export default router;
