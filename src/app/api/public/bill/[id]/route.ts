// import { NextResponse } from 'next/server';
// import connectMongoDB from '@/lib/mongodb';
// import Sale from '@/models/Sales'; 
// import User from '@/models/User';

// // --- FIX: Define the type for Next.js 15 Params (it must be a Promise) ---
// type RouteParams = {
//   params: Promise<{ id: string }>;
// };

// export async function GET(
//   request: Request,
//   { params }: RouteParams // Use the new type here
// ) {
//   try {
//     await connectMongoDB();
    
//     // --- FIX: Await the params object to get the ID ---
//     const { id } = await params; 

//     // 1. Find the Bill (Sale) by ID
//     const sale = await Sale.findById(id);
    
//     if (!sale) {
//       return NextResponse.json({ success: false, message: 'Bill not found' }, { status: 404 });
//     }

//     // 2. Find the Merchant Name
//     const merchant = await User.findOne({ email: sale.userEmail });

//     return NextResponse.json({ 
//       success: true, 
//       sale: sale,
//       merchantName: merchant?.name || "Merchant"
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching bill:", error);
//     return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
//   }
// }

// // Allow the customer to mark the bill as "Paid"
// export async function PUT(
//   request: Request,
//   { params }: RouteParams // Use the new type here as well
// ) {
//   try {
//     await connectMongoDB();
    
//     // --- FIX: Await the params object ---
//     const { id } = await params;
    
//     // Update status to completed
//     const updatedSale = await Sale.findByIdAndUpdate(
//       id,
//       { status: 'completed' },
//       { new: true }
//     );

//     return NextResponse.json({ success: true, sale: updatedSale }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating bill:", error);
//     return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Sales from '@/models/Sales'; 
import Tenant from '@/models/Tenant'; 
import User from '@/models/User';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteParams 
) {
  try {
    await connectToDatabase();
    
    // 1. Get Bill ID
    const { id } = await params; 

    // 2. Find Bill
    const sale = await Sales.findOne({ billId: id });
    
    if (!sale) {
      return NextResponse.json({ success: false, message: 'Bill not found' }, { status: 404 });
    }

    // 3. Find Merchant Name
    let merchantName = "Merchant";
    const tenant = await Tenant.findOne({ ownerEmail: sale.ownerEmail || sale.userEmail });
    if (tenant) {
      merchantName = tenant.businessName || "Store";
    } else {
      const user = await User.findOne({ email: sale.ownerEmail || sale.userEmail });
      if (user) merchantName = user.name;
    }

    return NextResponse.json({ 
      success: true, 
      sale: sale,
      merchantName: merchantName
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}