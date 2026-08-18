import { Router } from "express";
import { postReview, getReviews } from "../controllers/reviewController.js";

const router = Router();

router.post("/", postReview);
router.get("/", getReviews);

export default router;
