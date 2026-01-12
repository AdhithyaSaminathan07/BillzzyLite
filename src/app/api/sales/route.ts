// // src/app/api/sales/route.ts

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import dbConnect from "@/lib/mongodb";
// import Sale from "@/models/Sales";
// import { authOptions } from "@/lib/auth";

// /**
//  * GET: Securely fetches sales data ONLY for the currently logged-in user.
//  * This is a named export, which is correct.
//  */
// export async function GET(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const tenantId = session.user.email;

//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const period = searchParams.get('period');
//     const startParam = searchParams.get('startDate');
//     const endParam = searchParams.get('endDate');

//     // Default to today if nothing provided
//     let startDate: Date;
//     let endDate: Date = new Date();
//     const now = new Date(); // Start with current time
//     // Force now to use Indian Standard Time (IST) if deployed on UTC server
//     // But since we are doing date objects, let's keep it simple for now and rely on consistent server time.

//     if (startParam && endParam) {
//       // 1. Custom Date Range
//       startDate = new Date(startParam);
//       startDate.setHours(0, 0, 0, 0);

//       endDate = new Date(endParam);
//       endDate.setHours(23, 59, 59, 999);
//     } else {
//       // 2. Predefined Periods
//       switch (period) {
//         case 'weekly':
//           const firstDayOfWeek = now.getDate() - now.getDay();
//           startDate = new Date(now.setDate(firstDayOfWeek));
//           startDate.setHours(0, 0, 0, 0);

//           endDate = new Date(startDate);
//           endDate.setDate(endDate.getDate() + 6);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         case 'monthly':
//           startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//           startDate.setHours(0, 0, 0, 0);

//           endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         default: // 'today' or fallback
//           startDate = new Date();
//           startDate.setHours(0, 0, 0, 0);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//       }
//     }

//     const periodSales = await Sale.find({
//       tenantId: tenantId,
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     const cashSales = periodSales
//       .filter((sale) => sale.paymentMethod === "cash")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const qrSales = periodSales
//       .filter((sale) => sale.paymentMethod === "qr-code")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const cardSales = periodSales
//       .filter((sale) => sale.paymentMethod === "card")
//       .reduce((sum, sale) => sum + sale.amount, 0);

//     const totalProfit = periodSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

//     const totalSales = cashSales + qrSales + cardSales;
//     const billsCount = periodSales.length;

//     const result = {
//       total: totalSales,
//       cash: cashSales,
//       qr: qrSales,
//       card: cardSales,
//       profit: totalProfit,
//       bills: billsCount,
//       lastUpdated: new Date().toISOString(),
//     };

//     return NextResponse.json(result);

//   } catch (error) {
//     console.error("Failed to fetch sales data:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// /**
//  * POST: Securely creates a sale and assigns it to the currently logged-in user.
//  * This is a named export, which is correct.
//  */

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const tenantId = session.user.email;
//     await dbConnect();

//     const { amount, paymentMethod, profit } = await request.json();
//     if (!amount || !paymentMethod) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // Generate simple bill ID
//     const billId = `BILL-${Date.now()}`;

//     const newSale = new Sale({
//       tenantId,
//       billId,
//       amount,
//       paymentMethod,
//       profit: profit || 0,
//     });

//     await newSale.save();
//     return NextResponse.json({ message: "Sale created successfully", sale: newSale }, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create sale:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }


// // CRITICAL FIX: Make sure there are NO other exports below this line.
// // Especially, ensure there is NO 'export default ...' line in this file.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Sales from "@/models/Sales";
import Tenant from "@/models/Tenant";
import { authOptions } from "@/lib/auth";

/**
 * GET: Handles TWO things based on parameters:
 * 1. If 'period' or 'startDate' is present -> Returns STATISTICS (Totals, Counts) for Dashboard.
 * 2. If NO params are present -> Returns LIST of transactions for History.
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Find the Tenant ID based on the logged-in user's email
    // We need the _id to match what the Webhook uses.
    const tenant = await Tenant.findOne({ email: session.user.email });

    // Fallback: If tenant record doesn't exist yet, use email (legacy support), 
    // but ideally we want the object ID.
    const tenantIdQuery = tenant ? tenant._id.toString() : session.user.email;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');

    // === MODE A: FETCH LIST (For History Page) ===
    // If no stats parameters are provided, return the list of bills
    if (!period && !startParam) {
      const salesList = await Sales.find({ tenantId: tenantIdQuery })
        .sort({ createdAt: -1 })
        .limit(100); // Limit to last 100 to prevent overload
      return NextResponse.json(salesList);
    }

    // === MODE B: FETCH STATS (For Dashboard) ===
    let startDate: Date;
    let endDate: Date = new Date();
    const now = new Date();

    if (startParam && endParam) {
      startDate = new Date(startParam);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(endParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      switch (period) {
        case 'weekly':
          const firstDayOfWeek = now.getDate() - now.getDay();
          startDate = new Date(now.setDate(firstDayOfWeek));
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'today':
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
      }
    }

    const periodSales = await Sales.find({
      tenantId: tenantIdQuery,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate Totals (Only count PAID sales for totals)
    const validSales = periodSales.filter(sale => sale.status === 'paid' || sale.status === 'completed' || !sale.status);

    const cashSales = validSales
      .filter((sale) => sale.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const qrSales = validSales
      .filter((sale) => sale.paymentMethod === "qr-code" || sale.paymentMethod === "upi")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const cardSales = validSales
      .filter((sale) => sale.paymentMethod === "card")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalProfit = validSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    const totalSales = cashSales + qrSales + cardSales;

    return NextResponse.json({
      total: totalSales,
      cash: cashSales,
      qr: qrSales,
      card: cardSales,
      profit: totalProfit,
      bills: validSales.length,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Create a new Bill.
 * Supports "Pending" status for QR codes and saves items.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Get Tenant Object
    // We MUST use the Tenant's _id so the Webhook can find this bill later.
    // The Webhook doesn't know the email, it only knows the Tenant ID linked to the token.
    const tenant = await Tenant.findOne({ email: session.user.email });

    // If tenant doesn't exist (edge case), rely on email, but this breaks auto-payment.
    if (!tenant) {
      console.warn("Tenant not found for email, creating generic link");
      // Optional: Create tenant here if missing, or return error
    }

    const { amount, paymentMethod, profit, items, status, customerName } = await request.json();

    if (!amount || !paymentMethod) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 2. Generate a Webhook-Friendly Bill ID
    // Format: INV-{TIMESTAMP}-{RANDOM}
    // This ensures uniqueness and readability
    const billId = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 3. Create the Sale
    const newSale = new Sales({
      tenantId: tenant ? tenant._id.toString() : session.user.email, // Use ID if possible
      billId: billId,
      customerName: customerName || 'Walk-in',
      amount,
      items: items || [], // Save the cart items
      paymentMethod,
      profit: profit || 0,
      status: status || 'paid', // Default to paid (Cash), but accept 'pending' (QR)
      date: new Date()
    });

    await newSale.save();

    return NextResponse.json({
      success: true,
      message: "Sale created successfully",
      billId: newSale.billId,
      saleId: newSale._id
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}