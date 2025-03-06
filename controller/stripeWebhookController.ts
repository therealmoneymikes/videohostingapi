import {Request, Response} from "express"
import { PaymentService } from "../services/paymentService";


export const stripeWebhookHandler = async (req: Request, res: Response) => {
    const event = req.body;

    try {
        switch (event.type){
            case "payment_intent.succeeded":
                await PaymentService.handleSuccessfulPayment(event.data.object)
                break;

            case "payment_intent.payment_failed":
                await PaymentService.handleUnsuccessfulPayment(event.data.object)
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.sendStatus(200);
    } catch (error) {
            console.error("⚠️ Error processing webhook:", error);
            res.status(500).send("Internal Server Error");
    }
}