import Stripe from "stripe";
import { stripeConfig } from "../config/stripe";
import Payment, { PaymentStatus } from "../models/paymentmodel";
import { EmailService } from "./emailService";



export class PaymentService {
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
                status:"succeeded"
            })

            await newPayment.save();
            console.log("✅ Payment successfully saved to DB:", newPayment);


            //Notify user by email
            if(paymentIntent.metadata?.email){
                EmailService.sendSuccessfulPaymentEmail(
                  paymentIntent.metadata.email, newPayment
                );
                console.log("Sending email to: ", paymentIntent.metadata.email + "With Payment: ", newPayment)
            }
        } catch (error) {
            console.error("❌ Error handling successful payment:", error);
        }
    }

    static async handleUnsuccessfulPayment (paymentIntent: Stripe.PaymentIntent) {
        try {
            if(paymentIntent.status === "canceled"){
                EmailService.sendUnsuccessfulPaymentEmail(paymentIntent.metadata.email, paymentIntent.amount, paymentIntent.currency)
                console.log(
                  "Sending email to: ",
                  paymentIntent.metadata.email + "With Payment: ",
                );
            }
        } catch (error) {
            console.error("❌ Error handling successful payment:", error);
        }
    }
}