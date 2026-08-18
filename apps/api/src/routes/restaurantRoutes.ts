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
router.post("/:id/categories", postMenuCategory);
router.post("/:id/items", postMenuItem);
router.patch("/items/:itemId", patchMenuItem);
router.delete("/items/:itemId", deleteMenuItem);
router.patch("/tables/:tableId", patchTableStatus);
router.patch("/:id/tables/:tableId", patchTableStatus);
router.patch("/:id", authenticateToken, requireRoles("OWNER", "SUPER_ADMIN"), patchRestaurantProfile);

export default router;

