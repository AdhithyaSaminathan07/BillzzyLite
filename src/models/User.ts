// src/models/User.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; // Password is selected: false
  role: 'user' | 'admin';
  tenantId: Types.ObjectId; // A reference to the Tenant this user belongs to
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { 
    type: String, 
    required: true,
    select: false, // Password will not be returned in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // This links a User to a specific Tenant
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant', // This must match the name you used in mongoose.model('Tenant', ...)
    required: false, // Not required, because the admin user will not have a tenantId
  },
}, { timestamps: true });


export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);