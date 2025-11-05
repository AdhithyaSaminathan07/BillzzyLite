import mongoose, { Schema, models } from "mongoose";

const PurchaseSchema = new Schema(
  {
    shopName: { type: String, required: true },
    date: { type: String, required: true },
    products: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
  },
  { timestamps: true }
);

const Purchase = models.Purchase || mongoose.model("Purchase", PurchaseSchema);
export default Purchase;
