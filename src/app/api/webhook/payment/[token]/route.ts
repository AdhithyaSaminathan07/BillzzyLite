
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sales from "@/models/Sales";
import Tenant from "@/models/Tenant";
import PaytmChecksum from "paytmchecksum"; 

export async function POST(
  req: Request,
  props: { params: Promise<{ token: string }> }
) {
  try {
    // 1. Get the Token (Bill ID)
    const params = await props.params;
    const billId = params.token; // Using 'token' as requested

    console.log(`🔔 WEBHOOK: Received Paytm Callback for Bill (Token): ${billId}`);

    // 2. Parse Paytm Data
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paytmParams: any = {};
    formData.forEach((value, key) => {
      paytmParams[key] = value;
    });

    const STATUS = paytmParams.STATUS;
    const CHECKSUM = paytmParams.CHECKSUMHASH;

    // 3. Connect DB & Find Bill
    await connectToDatabase();
    const sale = await Sales.findOne({ billId: billId });

    if (!sale) {
      console.error("❌ WEBHOOK: Bill not found", billId);
      return NextResponse.redirect(new URL(`/pay/${billId}?status=bill_not_found`, req.url));
    }

    // 4. Verify Signature
    const tenant = await Tenant.findOne({ ownerEmail: sale.ownerEmail });
    const merchantKey = tenant?.paytmSecretKey || tenant?.merchantSecretKey;

    if (!merchantKey) {
       console.error("❌ WEBHOOK: Tenant keys missing");
       return NextResponse.redirect(new URL(`/pay/${billId}?status=merchant_error`, req.url));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await PaytmChecksum.verifySignature(paytmParams, merchantKey, CHECKSUM);
      
    if (!isValid) {
      console.log("❌ WEBHOOK: Signature Mismatch.");
      return NextResponse.redirect(new URL(`/pay/${billId}?status=security_error`, req.url));
    }

    // 5. Update Status & Redirect
    if (STATUS === "TXN_SUCCESS") {
      console.log("✅ WEBHOOK: Payment Success! Updating DB...");
      
      await Sales.findOneAndUpdate(
        { billId: billId },
        { 
          $set: { 
            status: "completed",
            paymentMethod: "Online",
            paymentId: paytmParams.TXNID
          }
        }
      );

      // Redirect to Receipt
      return NextResponse.redirect(new URL(`/receipt/bill/${billId}?status=success`, req.url));
    } else {
      console.log(`⚠️ WEBHOOK: Transaction Failed: ${STATUS}`);
      // Redirect back to Pay Page
      return NextResponse.redirect(new URL(`/pay/${billId}?status=failed`, req.url));
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}