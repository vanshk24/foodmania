import { Router } from "express";
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  postMenuCategory,
  postMenuItem,
  patchMenuItem,
  deleteMenuItem,
  patchTableStatus,
  patchRestaurantProfile,
} from "../controllers/restaurantController.js";
import { optionalAuth, authenticateToken, requireRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(optionalAuth);

router.get("/", getRestaurants);
router.get("/:id/menu", getRestaurantMenu);
router.get("/:id", getRestaurantById);
router.post("/:id/categories", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), postMenuCategory);
router.post("/:id/items", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), postMenuItem);
router.patch("/items/:itemId", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), patchMenuItem);
router.delete("/items/:itemId", authenticateToken, requireRoles("OWNER", "STAFF", "SUPER_ADMIN"), deleteMenuItem);
router.patch("/tables/:tableId", patchTableStatus);
router.patch("/:id/tables/:tableId", patchTableStatus);
router.patch("/:id", authenticateToken, requireRoles("OWNER", "SUPER_ADMIN"), patchRestaurantProfile);

export default router;

