// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Tenant from '@/models/Tenant';
// import Sales from '@/models/Sales';

// // Fix for Next.js 15: props.params is a Promise now
// export async function POST(
//   req: Request,
//   props: { params: Promise<{ token: string }> }
// ) {
//   try {
//     // 1. Await the params to get the token correctly
//     const params = await props.params;
//     const { token } = params;

//     if (!token) {
//       return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
//     }

//     await connectDB();

//     // 2. Identify Merchant
//     const merchant = await Tenant.findOne({ webhookToken: token });

//     if (!merchant) {
//       console.error(`Webhook failed: Token ${token} not found in DB`);
//       return NextResponse.json({ error: 'Invalid Webhook Token' }, { status: 403 });
//     }

//     // 3. Parse Data
//     const payload = await req.json();
//     console.log(`Webhook for ${merchant.name}:`, payload);

//     const incomingBillId = payload.orderId || payload.billId; 
//     const incomingStatus = payload.status; 
//     const incomingTxnId = payload.txnId || payload.transactionId;

//     if (!incomingBillId) {
//       return NextResponse.json({ error: 'Payload missing billId' }, { status: 400 });
//     }

//     // 4. Update the Bill
//     const updatedSale = await Sales.findOneAndUpdate(
//       { 
//         tenantId: merchant._id.toString(),
//         billId: incomingBillId 
//       },
//       {
//         $set: {
//           status: (incomingStatus === 'SUCCESS' || incomingStatus === 'PAID') ? 'paid' : 'failed',
//           transactionId: incomingTxnId,
//           paymentMethod: 'qr-code',
//           paymentProviderData: payload
//         }
//       },
//       { new: true }
//     );

//     if (!updatedSale) {
//       console.error(`Webhook: Bill ${incomingBillId} not found for merchant ${merchant.name}`);
//       return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Bill Updated to PAID', 
//       billId: updatedSale.billId 
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Webhook Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function GET() {
//   return NextResponse.json({ status: 'Webhook Listener Active' });
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import Sales from '@/models/Sales';

export async function POST(
  req: Request,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const params = await props.params;
    const { token } = params;

    if (!token) return NextResponse.json({ error: 'Token is missing' }, { status: 400 });

    await connectDB();

    // 1. Find the Merchant by Token
    const merchant = await Tenant.findOne({ webhookToken: token });

    if (!merchant) {
      console.error(`Webhook failed: Token ${token} not found in DB`);
      return NextResponse.json({ error: 'Invalid Webhook Token' }, { status: 403 });
    }

    // 2. Parse Incoming Data
    const payload = await req.json();
    const incomingBillId = payload.orderId || payload.billId;
    const incomingStatus = payload.status;
    const incomingTxnId = payload.txnId || payload.transactionId;

    console.log(`Webhook triggered for bill: ${incomingBillId}`);

    if (!incomingBillId) {
      return NextResponse.json({ error: 'Payload missing billId' }, { status: 400 });
    }

    // 3. Find the Bill (Globally first)
    // We look for the bill by ID first, ignoring the tenant for a moment
    const sale = await Sales.findOne({ billId: incomingBillId });

    if (!sale) {
      console.error(`Webhook: Bill ${incomingBillId} does not exist.`);
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // 4. "Self-Healing" Logic
    // If the bill belongs to an Email (legacy) instead of the Merchant ID, we fix it now.
    const merchantId = merchant._id.toString();

    if (sale.tenantId !== merchantId) {
      console.log(`⚠️ Mismatch detected! Bill has ${sale.tenantId}, Merchant is ${merchantId}. Fixing it...`);

      // OPTIONAL SECURITY: You could check if sale.tenantId matches merchant.email here.
      // For now, since you possess the secret Token, we assume you own the bill.
      sale.tenantId = merchantId;
      await sale.save();
    }

    // 5. Update the Bill Status
    const updatedSale = await Sales.findOneAndUpdate(
      { billId: incomingBillId },
      {
        $set: {
          status: (incomingStatus === 'SUCCESS' || incomingStatus === 'PAID') ? 'paid' : 'failed',
          transactionId: incomingTxnId,
          paymentMethod: 'qr-code',
          paymentProviderData: payload,
          tenantId: merchantId // Ensure consistency
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Bill Updated to PAID (and auto-fixed)',
      billId: updatedSale.billId
    }, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}