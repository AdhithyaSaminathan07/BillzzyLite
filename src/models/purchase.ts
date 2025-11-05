import mongoose, { Schema, models, Document } from "mongoose";

interface IPurchaseProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IPurchase extends Document {
  tenantId: string;
  shopName: string;
  date: string;
  products: IPurchaseProduct[];
  totalAmount: number;
  paymentStatus: "paid" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    shopName: { type: String, required: true },
    date: { type: String, required: true },
    products: { type: [Object], required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const Purchase = models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema);
export default Purchase;
