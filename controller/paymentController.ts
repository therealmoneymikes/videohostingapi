import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    try {
      const { amount, currency, paymentMethodId } = req.body;
      const paymentIntent = await PaymentService.createPaymentIntent(
        amount,
        currency,
        paymentMethodId
      );
      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      if (error instanceof Error)
        res
          .status(500)
          .json({
            success: false,
            error: error.message || "Payment Processing Error",
          });
    }
  }
}
