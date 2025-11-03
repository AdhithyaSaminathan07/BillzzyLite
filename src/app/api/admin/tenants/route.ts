// src/app/api/admin/tenants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Sale from '@/models/Sales';

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
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email createdAt');
    
    // Get bill count for each user with optional date filtering
    const usersWithBillCount = await Promise.all(users.map(async (user) => {
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