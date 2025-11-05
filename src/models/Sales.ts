import mongoose, { Schema, models, Document } from "mongoose";

export interface ISale extends Document {
  tenantId: string;
  billId: string;
  amount: number;
  paymentMethod: "cash" | "qr-code" | "card";
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  billId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "qr-code", "card"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
export default Sale;
