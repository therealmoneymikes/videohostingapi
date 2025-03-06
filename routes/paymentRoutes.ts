import { Router } from "express";
import { PaymentController } from "../controller/paymentController";


const router = Router();


router.post("/create-payment-intent", PaymentController.createPayment);

export default router