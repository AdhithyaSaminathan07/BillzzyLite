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

// Helper to determine the correct base URL
function getBaseUrl(req?: Request) {
  let baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl && req) {
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    baseUrl = `${protocol}://${host}`;
  }

  // Fallback if no req and no env (should rarely happen in API routes)
  if (!baseUrl) {
    baseUrl = 'http://localhost:3000';
  }

  // Normalize: remove trailing slash
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return baseUrl;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const subdomain = session.user.email.split('@')[0];

    // Fetch real data
    const merchant = await Tenant.findOne({ subdomain });

    // Dynamic Webhook URL Generation
    let dynamicWebhookUrl = '';
    const token = merchant?.webhookToken;

    // Only generate URL if we have a token. 
    // Prioritize NEXTAUTH_URL by using the helper functions.
    if (token) {
      const baseUrl = getBaseUrl(req);
      dynamicWebhookUrl = `${baseUrl}/api/webhook/payment/${token}`;
    }

    return NextResponse.json({
      name: merchant?.name || session.user.name,
      phoneNumber: session.user.phoneNumber || '',
      upiId: merchant?.upiId || '',
      // Always return the dynamically generated URL to ensure it matches the current env
      webhookUrl: dynamicWebhookUrl,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...body };

    // --- FIX FOR NEW TENANT CREATION ---
    if (!existingTenant) {
      updateData.name = session.user.name;
      updateData.email = session.user.email;
      updateData.subdomain = subdomain;
    }

    // --- IMPROVED TOKEN GENERATION LOGIC ---
    // 1. Get or Generate Token
    let tokenToUse = existingTenant?.webhookToken;
    if (!tokenToUse) {
      console.log("Token missing. Generating new Webhook Token...");
      tokenToUse = crypto.randomBytes(16).toString('hex');
      updateData.webhookToken = tokenToUse;
    }

    // 2. Determine Base URL (Dynamic)
    const baseUrl = getBaseUrl(req);

    // 3. Set/Update the Full URL 
    // (We update it in DB too, just in case, though GET now ignores it)
    updateData.webhookUrl = `${baseUrl}/api/webhook/payment/${tokenToUse}`;
    // ---------------------------------------

    // 3. Update Database
    const updated = await Tenant.findOneAndUpdate(
      { subdomain },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}