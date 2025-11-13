// src/app/api/admin/tenants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import Sale from '@/models/Sales';
import Product from '@/models/Product';
import Purchase from '@/models/purchase';

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
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email createdAt phoneNumber');
    
    // Get bill count for each user with optional date filtering
    const usersWithBillCount = await Promise.all(users.map(async (user: IUser) => {
      // Build the query for sales
      const saleQuery: { tenantId: string; createdAt?: { $gte?: Date; $lte?: Date } } = { tenantId: user.email };
      
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
    
    // Delete the tenant user
    await User.deleteOne({ _id: userId });
    
    // Also delete all sales records associated with this tenant
    await Sale.deleteMany({ tenantId: user.email });
    
    // Also delete all products associated with this tenant
    await Product.deleteMany({ tenantId: user.email });
    
    // Also delete all purchases associated with this tenant
    await Purchase.deleteMany({ tenantId: user.email });
    
    return NextResponse.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}