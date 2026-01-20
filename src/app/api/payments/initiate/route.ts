
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongodb";
// import Tenant from "@/models/Tenant";
// import Sales from "@/models/Sales"; 
// import { createPaymentOrder } from "@/lib/payment-agent"; 

// export async function POST(req: Request) {
//   try {
//     await connectToDatabase();
    
//     // 1. GET INPUT
//     const body = await req.json();
//     const { billId, amount, customerId } = body;

//     console.log(`🔹 [API] Initiating Payment for Bill: ${billId}`);

//     if (!billId || !amount) {
//       return NextResponse.json({ error: "Missing Bill ID or Amount" }, { status: 400 });
//     }

//     // 2. FIND BILL
//     const sale = await Sales.findOne({ billId: billId });
//     if (!sale) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

//     // 3. FIND MERCHANT
//     let tenant = null;
//     let searchEmail = "";

//     if (sale.tenantId && typeof sale.tenantId === 'string' && sale.tenantId.includes('@')) {
//       searchEmail = sale.tenantId;
//     } else if (sale.ownerEmail || sale.userEmail) {
//       searchEmail = sale.ownerEmail || sale.userEmail;
//     }

//     if (searchEmail) {
//       tenant = await Tenant.findOne({ 
//         ownerEmail: { $regex: new RegExp(`^${searchEmail}$`, 'i') } 
//       });
//     }

//     if (!tenant) return NextResponse.json({ error: "Merchant not found" }, { status: 400 });

//     // 4. GET KEYS
//     const MID = tenant.merchantId || tenant.paytmMid;
//     const KEY = tenant.merchantSecretKey || tenant.paytmSecretKey;
    
//     if (!MID || !KEY) return NextResponse.json({ error: "Keys missing" }, { status: 400 });

//     // 5. CALL AGENT
//     const result = await createPaymentOrder({
//       orderId: billId,
//       amount: amount,
//       customerId: customerId || "GUEST",
//       merchantId: MID,         
//       merchantKey: KEY, 
//       callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/webhook/payment/${billId}`
//     });

//     if (result.success) {
//       return NextResponse.json(result);
//     } else {
//       console.log("❌ [API] Agent Failed:", result.error);
//       return NextResponse.json({ 
//         success: false, 
//         error: result.error 
//       }, { status: 500 });
//     }

//   } catch (error: any) {
//     console.error("❌ [API] Exception:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Sales from "@/models/Sales"; 
import { createPaymentOrder } from "@/lib/payment-agent"; 

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // 1. GET INPUT
    const body = await req.json();
    const { billId, amount, customerId } = body;

    console.log(`🔹 [API] Initiating Payment for Bill: ${billId}`);

    if (!billId || !amount) {
      return NextResponse.json({ error: "Missing Bill ID or Amount" }, { status: 400 });
    }

    // 2. FIND BILL
    const sale = await Sales.findOne({ billId: billId });
    if (!sale) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

    // 3. FIND MERCHANT
    let tenant = null;
    let searchEmail = "";

    if (sale.tenantId && typeof sale.tenantId === 'string' && sale.tenantId.includes('@')) {
      searchEmail = sale.tenantId;
    } else if (sale.ownerEmail || sale.userEmail) {
      searchEmail = sale.ownerEmail || sale.userEmail;
    }

    if (searchEmail) {
      tenant = await Tenant.findOne({ 
        ownerEmail: { $regex: new RegExp(`^${searchEmail}$`, 'i') } 
      });
    }

    if (!tenant) return NextResponse.json({ error: "Merchant not found" }, { status: 400 });

    // 4. GET KEYS
    const MID = tenant.merchantId || tenant.paytmMid;
    const KEY = tenant.merchantSecretKey || tenant.paytmSecretKey;
    
    if (!MID || !KEY) return NextResponse.json({ error: "Keys missing" }, { status: 400 });

    // 5. CALL AGENT
    const result = await createPaymentOrder({
      orderId: billId,
      amount: amount,
      customerId: customerId || "GUEST",
      merchantId: MID,         
      merchantKey: KEY, 
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/webhook/payment/${billId}`
    });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      console.log("❌ [API] Agent Failed:", result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [API] Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}