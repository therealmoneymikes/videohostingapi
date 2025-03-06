import mongoose, {Document, Model} from "mongoose"



export enum PaymentStatus {
    PENDING = "PENDING",
    FAILED = "FAILED",
    SUCCESSFUL = "SUCCESSFUL"
}
interface IPayments extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    stripePaymentId: string,
    amount: number,
    currency: string,
    status: string,
    createdAt: Date
}

const PaymentSchema = new mongoose.Schema<IPayments>({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    stripePaymentId: {type: String, required: true, unique: true},
    amount: {type: Number, required: true},
    currency: {type: String, required: true},
    status: {type: String, enum: PaymentStatus, required: true, default: PaymentStatus.PENDING},
    createdAt: {type: Date, default: Date.now()},
}, {timestamps: true})


const Payment = mongoose.model<IPayments>("Payment", PaymentSchema)
export default Payment;