import { Stripe } from "stripe";
import dotenv from "dotenv"

dotenv.config();
export const stripeConfig = new Stripe(process.env.STRIPE_TEST_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});
