// // src/app/api/merchant/details/route.ts
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';

// export async function GET() {
//   try {
//     // Get the user's session
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user?.email) {
//       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
//     }
    
//     // Return merchant details
//     // In production, you'd fetch this from a database
//     const merchantDetails = {
//       name: session.user.name || 'Billzzy Merchant',
//       email: session.user.email,
//       upiId: 'varunprasanna2020-1@oksbi', // From your existing code
//       phoneNumber: '9597586785', // From your existing code
//     };
    
//     return NextResponse.json(merchantDetails);
//   } catch (error) {
//     console.error('Error fetching merchant details:', error);
//     return NextResponse.json({ 
//       error: 'Internal server error',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const subdomain = session.user.email.split('@')[0];
    
    // Fetch real data
    const merchant = await Tenant.findOne({ subdomain });

    return NextResponse.json({
      name: merchant?.name || session.user.name,
      phoneNumber: session.user.phoneNumber || '',
      upiId: merchant?.upiId || '',
      webhookUrl: merchant?.webhookUrl || '',
    });
  } catch (error) {
    console.error('Error fetching merchant details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    const subdomain = session.user.email.split('@')[0];

    // 1. Find the Tenant
    let existingTenant = await Tenant.findOne({ subdomain });
    
    if (!existingTenant) {
      // Create if doesn't exist (Unlikely but safe)
      existingTenant = new Tenant({
        name: session.user.name,
        email: session.user.email,
        subdomain: subdomain
      });
    }

    // 2. Prepare Update Data
    const updateData: any = { ...body };

    // --- IMPROVED TOKEN GENERATION LOGIC ---
    // Check if the tenant is missing a webhookToken. 
    // If it is missing, generate it NOW, regardless of what else is being updated.
    if (!existingTenant.webhookToken || !existingTenant.webhookUrl) {
      console.log("Token missing. Generating new Webhook Token...");
      
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      
      // Determine Base URL securely
      let baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
      
      // Fallback if .env is missing (common in localhost)
      if (!baseUrl) {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        baseUrl = `${protocol}://${host}`;
      }

      // Remove trailing slash if present
      if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

      updateData.webhookUrl = `${baseUrl}/api/webhook/payment/${uniqueToken}`;
      updateData.webhookToken = uniqueToken;
    }
    // ---------------------------------------

    // 3. Update Database
    const updated = await Tenant.findOneAndUpdate(
      { subdomain },
      { $set: updateData },
      { upsert: true, new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}