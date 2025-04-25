import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

router.post("/order", validateToken, createPaymentOrder);
router.post("/verify", validateToken, verifyPayment);

export default router;