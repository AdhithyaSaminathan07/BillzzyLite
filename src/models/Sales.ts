// import mongoose, { Schema, models, Document } from "mongoose";

// export interface ISale extends Document {
//   tenantId: string;
//   billId: string;
//   amount: number;
//   paymentMethod: "cash" | "qr-code" | "card";
//   createdAt: Date;
// }

// const SaleSchema = new Schema<ISale>({
//   tenantId: {
//     type: String,
//     required: true,
//     index: true,
//   },
//   billId: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["cash", "qr-code", "card"],
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, {
//   collection: 'sales' // Explicitly specify collection name
// });

// const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
// export default Sale;


import mongoose, { Schema, models, Document } from "mongoose";

export interface ISale extends Document {
  tenantId: string;
  billId: string;
  amount: number;
  paymentMethod: "cash" | "qr-code" | "card";
  // ✅ ADDED THESE FIELDS
  status: string;
  items: { name: string; quantity: number; price: number }[];
  publicToken?: string;
  expiresAt?: Date;
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
  tenantId: { type: String, required: true, index: true },
  billId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "qr-code", "card"],
    required: true,
  },
  status: { type: String, default: "pending" },
  
  // ✅ ADDED: To store the cart items
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],

  // ✅ ADDED: Random Token for the link
  publicToken: { 
    type: String, 
    unique: true, 
    sparse: true 
  },

  // ✅ ADDED: Expiration Date
  expiresAt: { 
    type: Date 
  },

  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'sales'
});

const Sale = models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
export default Sale;