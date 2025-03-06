import Stripe from "stripe";
import { stripeConfig } from "../config/stripe";
import Payment, { PaymentStatus } from "../models/paymentmodel";



export class StripeService {
    static async createPaymentIntent(amount: number, currency: string, paymentMethodId: string) {
        return await stripeConfig.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        })
    }


    static async handleSuccessfulPayment (paymentIntent: Stripe.PaymentIntent) {
        try {
            //Check if payment already exists to prevent duplicate processing
            const existingPayment = await Payment.findOne({stripePaymentId: paymentIntent.id});
            if(existingPayment) return

            const newPayment = new Payment({
                userId: paymentIntent.metadata?.userId,
                stripePaymentId: paymentIntent.id,
                amount: paymentIntent.amount_received / 100, //Convert from cents
                currency: paymentIntent.currency,
                status: PaymentStatus.SUCCESSFUL
            })

            await newPayment.save();
            console.log("✅ Payment successfully saved to DB:", newPayment);


            //Notify user by email
            if(paymentIntent.metadata?.email){
                console.log("Sending email to: ", paymentIntent.metadata.email + "With Payment: ", newPayment)
            }
        } catch (error) {
            console.error("❌ Error handling successful payment:", error);
        }
    }
}