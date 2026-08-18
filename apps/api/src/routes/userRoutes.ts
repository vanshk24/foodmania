import { Router } from "express";
import { getUser, patchUser } from "../controllers/userController.js";

const router = Router();

router.get("/:id", getUser);
router.patch("/:id", patchUser);

export default router;
