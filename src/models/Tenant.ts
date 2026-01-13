// import mongoose, { Schema, Document } from 'mongoose';

// export interface ITenant extends Document {
//   name: string;
//   subdomain: string;
// }

// const TenantSchema: Schema = new Schema({
//   name: { type: String, required: true },
//   subdomain: { type: String, required: true, unique: true },
// }, {
//   collection: 'tenants' // Explicitly specify collection name
// });

// export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  subdomain: string;
  email?: string;
  phoneNumber?: string;
  upiId?: string;
  merchantId?: string;
  merchantSecretKey?: string;
  webhookUrl?: string;
  webhookToken?: string;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },

  // ✅ ADD THESE FIELDS SO MONGOOSE SAVES THEM
  email: { type: String },
  phoneNumber: { type: String },
  upiId: { type: String },
  merchantId: { type: String }, // NEW: Merchant ID
  merchantSecretKey: { type: String }, // NEW: Merchant Secret Key
  webhookUrl: { type: String },
  // sparse: true allows multiple users to have 'null' token, but if it exists it must be unique
  webhookToken: { type: String, unique: true, sparse: true },
}, {
  collection: 'tenants',
  timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);