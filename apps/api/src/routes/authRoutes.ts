import { Router } from "express";
import { register, registerRestaurant, login, getMe, refresh } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

const limiter = authRateLimiter(60, 15 * 60 * 1000);

router.post("/register", limiter, register);
router.post("/register-restaurant", limiter, registerRestaurant);
router.post("/login", limiter, login);
router.post("/refresh", limiter, refresh);
router.get("/me", authenticateToken, getMe);

export default router;

