import { Router } from "express";
import {
  getUsers,
  patchUser,
  getRestaurants,
  postRestaurant,
  patchRestaurant,
  deleteRestaurant,
  getSubscriptions,
  getAnalytics,
} from "../controllers/adminController.js";
import { authenticateToken, requireRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Enforce Super Admin Authentication & Authorization Middleware
router.use(authenticateToken, requireRoles("SUPER_ADMIN"));

router.get("/users", getUsers);
router.patch("/users/:id", patchUser);
router.get("/restaurants", getRestaurants);
router.post("/restaurants", postRestaurant);
router.patch("/restaurants/:id", patchRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.get("/subscriptions", getSubscriptions);
router.get("/analytics", getAnalytics);

export default router;
