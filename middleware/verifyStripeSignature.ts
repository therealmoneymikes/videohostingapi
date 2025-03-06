import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import dotenv from "dotenv"
import { stripeConfig } from "../config/stripe";



dotenv.config();



export const verifyStripeSignature = (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookEndpointSecret = process.env.WEBHOOK_SECRET as string;

    try {
        const event = stripeConfig.webhooks.constructEvent(req.body, sig, webhookEndpointSecret)

        if(event.type == "payment_intent.succeeded"){
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("✅ Payment successful:", paymentIntent.id);
            res.status(200).send("Webhook received")
        }
    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(400).send("Webhook Error");
    }
}