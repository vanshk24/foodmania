import { Router } from "express";
import {
  postCreatePayment,
  getPaymentById,
  getPaymentByOrder,
  getPaymentsList,
  patchPaymentStatus,
  postDevConfirm,
  postVerifyStub,
  postWebhookStub,
} from "../controllers/paymentController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(optionalAuth);

router.post("/create", postCreatePayment);
router.post("/dev-confirm", postDevConfirm);
router.get("/", getPaymentsList);
router.get("/:id", getPaymentById);
router.get("/order/:orderId", getPaymentByOrder);
router.patch("/:id/status", patchPaymentStatus);
router.post("/verify", postVerifyStub);
router.post("/webhook", postWebhookStub);

export default router;
