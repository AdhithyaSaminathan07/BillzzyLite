

// src/app/api/admin/tenants/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    // THIS IS THE CORRECT QUERY THAT WILL FIX EVERYTHING
    // It means: "Find all users where the role is NOT 'admin'".
    // This will find the two users in your picture because their role is not 'admin'.
    const users = await User.find({ role: { $ne: 'admin' } }).select('name email createdAt');

    return NextResponse.json(users);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}