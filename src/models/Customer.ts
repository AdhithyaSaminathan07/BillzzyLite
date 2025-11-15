import mongoose, { Schema, models, Document } from "mongoose";

export interface ICustomer extends Document {
  tenantId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'customers',
  timestamps: true
});

const Customer = models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;