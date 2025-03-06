import express from "express";
import { PaymentController } from "../controller/paymentController";
import l from "express"
import { stripeWebhookHandler } from "../controller/stripeWebhookController";

const router = express.Router()



router.post("/create-payment-intent", PaymentController.createPayment);
router.post("/webhook", express.raw({type: "application/json"}), stripeWebhookHandler);

export default router