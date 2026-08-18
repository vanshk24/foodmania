import { Router } from "express";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

export default router;
