// src/app/api/users/check/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sales';
import Product from '@/models/Product';
import Purchase from '@/models/purchase';
import Customer from '@/models/Customer';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    
    // Check if user has any data in any of the collections
    const hasSales = await Sale.exists({ tenantId: email });
    const hasProducts = await Product.exists({ tenantId: email });
    const hasPurchases = await Purchase.exists({ tenantId: email });
    const hasCustomers = await Customer.exists({ tenantId: email });
    
    const hasData = !!(hasSales || hasProducts || hasPurchases || hasCustomers);
    
    return NextResponse.json({ hasData });
  } catch (error) {
    console.error('Check user data error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}