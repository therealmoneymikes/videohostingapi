import mongoose, { model, Document, Schema, ObjectId } from "mongoose";

enum MembershipLevel {
  BASIC = "basic",
  PREMIUM = "premium",
  ELITE = "elite",
}

enum PaymentMethod {
  CARD = "card",
  PAYPAL = "paypal",
  STRIPE = "stripe",
}

type TPurchaseHistory = { videoId: ObjectId; purchasedAt: Date };

enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

enum UserRoles {
  CUSTOMER = "customer",
  ADMIN = "admin",
}
export interface ICustomer extends Document {
  user: ObjectId;
  address: {
    street: string;
    postcode: string;
    city: string;
    country: string;
  };
  phone: string;
  membership: MembershipLevel;
  paymentDetials: {
    paymentMethod: PaymentMethod;
    paymentDetails: string;
  };
  purchaseHistory: TPurchaseHistory[];
  subscriptionStatus: SubscriptionStatus;
  role: UserRoles;
  createdAt: Date;
}

export const customerSchema = new Schema<ICustomer>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String },
  phone: { type: String },
  membership: {
    type: String,
    enum: MembershipLevel,
    default: MembershipLevel.BASIC,
  },
  paymentDetials: {
    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      default: PaymentMethod.CARD,
    },
    paymentDetails: { type: String },
  },
  purchaseHistory: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
      purchasedAt: { type: Date },
    },
  ],
  subscriptionStatus: {
    type: String,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INACTIVE,
  },
  role: { type: String, enum: UserRoles, default: UserRoles.CUSTOMER },
  createdAt: { type: Date, default: Date.now },
});


export default model<ICustomer>("Customer", customerSchema)