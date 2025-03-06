import { stripeConfig } from "../config/stripe";


export class StripeService {
    static async createPaymentIntent(amount: number, currency: string, paymentMethodId: string) {
        return await stripeConfig.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        })
    }
}