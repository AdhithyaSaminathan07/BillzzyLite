// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Sales from '@/models/Sales';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const billId = searchParams.get('billId');

//     if (!billId) return NextResponse.json({ error: 'Bill ID required' }, { status: 400 });

//     await connectDB();
    
//     // Check status of the specific bill
//     const sale = await Sales.findOne({ billId }).select('status');

//     if (!sale) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     return NextResponse.json({ status: sale.status });
//   } catch (error) {
//     return NextResponse.json({ error: 'Error' }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sales from "@/models/Sales";

// 🛑 FORCE DYNAMIC: This ensures we fetch real-time data, not cached data.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const billId = searchParams.get("billId");

    if (!billId) {
      return NextResponse.json({ error: "Bill ID required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Find the bill
    const sale = await Sales.findOne({ billId }).select("status amount");

    if (!sale) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Return the status (e.g., "completed", "pending")
    return NextResponse.json({ 
      status: sale.status,
      amount: sale.amount 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}