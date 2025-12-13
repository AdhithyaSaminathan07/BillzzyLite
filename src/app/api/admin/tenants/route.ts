// src/app/api/admin/tenants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import Sale from '@/models/Sales';
import Product from '@/models/Product';
import Purchase from '@/models/purchase';
import Customer from '@/models/Customer';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Find all users where the role is NOT 'admin'
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email createdAt phoneNumber onboarded');

    // Get bill count for each user with optional date filtering
    const usersWithBillCount = await Promise.all(users.map(async (user: IUser) => {
      // Build the query for sales - use regex for case-insensitive matching
      const saleQuery: { tenantId: { $regex: RegExp }; createdAt?: { $gte?: Date; $lte?: Date } } = {
        tenantId: { $regex: new RegExp(`^${user.email}$`, 'i') }
      };

      // Add date filters if provided
      if (startDate || endDate) {
        saleQuery.createdAt = {};
        if (startDate) {
          saleQuery.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          saleQuery.createdAt.$lte = new Date(endDate);
        }
      }

      const billCount = await Sale.countDocuments(saleQuery);
      return {
        ...user.toObject(),
        billCount
      };
    }));

    return NextResponse.json(usersWithBillCount);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { userId, onboarded } = await request.json();

    if (!userId || typeof onboarded !== 'boolean') {
      return NextResponse.json({ message: 'Invalid Input' }, { status: 400 });
    }

    const startUpdate = Date.now();
    const user = await User.findByIdAndUpdate(userId, { onboarded }, { new: true });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Find the user and check if it's a tenant
    const user = await User.findOne({ _id: userId, role: { $ne: 'admin' } });

    if (!user) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }

    // Delete all data associated with this tenant
    // 1. Delete the tenant user
    await User.deleteOne({ _id: userId });

    // 2. Delete all sales records associated with this tenant
    await Sale.deleteMany({ tenantId: user.email });

    // 3. Delete all products associated with this tenant
    await Product.deleteMany({ tenantId: user.email });

    // 4. Delete all purchases associated with this tenant
    await Purchase.deleteMany({ tenantId: user.email });

    // 5. Delete all customers associated with this tenant
    await Customer.deleteMany({ tenantId: user.email });

    // Note: If there are any other collections that store tenant-specific data,
    // they should also be deleted here to ensure complete data removal

    return NextResponse.json({
      message: 'Tenant and all associated data deleted successfully. User can now start fresh.'
    });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}