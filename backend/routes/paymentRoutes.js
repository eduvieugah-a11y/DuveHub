import express from "express";

import {
  initializePaystackPayment,
  verifyPaystackPayment,
  handlePaystackWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

//Initialize a Paystack payment
router.post("/initialize", initializePaystackPayment);

//Verify a Paystack payment
router.get("/verify/:reference", verifyPaystackPayment);

//Paystack webhook
router.post("/webhook", handlePaystackWebhook);

export default router;
