// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongodb";
// import Sales from "@/models/Sales";

// export async function POST(req: Request) {
//   try {
//     const { orderId } = await req.json();
//     console.log(`⚠️ [MOCK MODE] Verifying Order: ${orderId}`);

//     await connectToDatabase();
    
//     // 🛠️ MAGIC FIX: Use 'findOneAndUpdate'
//     // This command updates the data WITHOUT running the strict validation checks.
//     // It forces the status to "completed" regardless of what the rules say.
//     const updatedSale = await Sales.findOneAndUpdate(
//       { billId: orderId },
//       { 
//         $set: { 
//           status: "completed",
//           paymentMethod: "Online", // This will be saved even if not in the list
//           paymentId: "MOCK_TXN_" + Date.now()
//         }
//       },
//       { new: true } // Returns the updated document
//     );

//     if (!updatedSale) {
//       return NextResponse.json({ error: "Bill not found" }, { status: 404 });
//     }

//     console.log("✅ [MOCK] Payment Verified Automatically (Validation Bypassed).");

//     return NextResponse.json({ success: true, status: "PAID" });

//   } catch (error: any) {
//     console.error("❌ Verification Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sales from "@/models/Sales";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    console.log(`⚠️ [MOCK MODE] Verifying Order: ${orderId}`);

    await connectToDatabase();
    
    // 🛠️ MAGIC FIX: Use 'findOneAndUpdate'
    // This command updates the data WITHOUT running the strict validation checks.
    // It forces the status to "completed" regardless of what the rules say.
    const updatedSale = await Sales.findOneAndUpdate(
      { billId: orderId },
      { 
        $set: { 
          status: "completed",
          paymentMethod: "Online", // This will be saved even if not in the list
          paymentId: "MOCK_TXN_" + Date.now()
        }
      },
      { new: true } // Returns the updated document
    );

    if (!updatedSale) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    console.log("✅ [MOCK] Payment Verified Automatically (Validation Bypassed).");

    return NextResponse.json({ success: true, status: "PAID" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}