// // This is the NEW, CORRECT code that follows your database rules.

// import { NextResponse } from 'next/server';
// import connectMongoDB from '@/lib/mongodb';
// import Sale from '@/models/Sales';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from '@/lib/auth';

// interface CartItemPayload {
//   name: string;
//   quantity: number;
//   price: number;
// }

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user || !session.user.email) {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//     const tenantId = session.user.email;
//     await connectMongoDB();
//     const { cart, totalAmount } = await request.json();

//     if (!cart || !Array.isArray(cart) || cart.length === 0 || typeof totalAmount !== 'number') {
//         return NextResponse.json({ success: false, message: 'Invalid or missing bill data' }, { status: 400 });
//     }
    
//     const billId = `NFC-${Date.now().toString().slice(-8)}`;

//     const newSale = await Sale.create({
//       billId: billId,
//       tenantId: tenantId,
//       userEmail: session.user.email,
//       items: cart.map((item: CartItemPayload) => ({
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//       })),
//       amount: totalAmount,
//       // --- FINAL FIX ---
//       // Use "qr-code" because it is one of the allowed values in your Sales.ts model
//       paymentMethod: 'qr-code', 
//       status: 'pending',
//       createdAt: new Date(),
//     });
    
//     const orderId = newSale._id.toString();

//     return NextResponse.json({ success: true, orderId: orderId }, { status: 201 });

//   } catch (error) {
//     console.error("Error in nfc-link API:", error);
//     return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales'; // Default import
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';

// Define a type for the items in the cart
interface CartItemPayload {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    // 1. Check Authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fix: Use the user's email directly as the tenantId (matches your data structure)
    const tenantId = session.user.email;

    await connectMongoDB();

    const { cart, totalAmount } = await request.json();

    // 3. Validate Input
    if (!cart || !Array.isArray(cart) || cart.length === 0 || typeof totalAmount !== 'number') {
        return NextResponse.json({ success: false, message: 'Invalid or missing bill data' }, { status: 400 });
    }
    
    // 4. Generate Bill ID
    const billId = `NFC-${Date.now().toString().slice(-8)}`;

    // 5. Create Sale in Database
    const newSale = await Sale.create({
      billId: billId,
      tenantId: tenantId, // Using email as tenantId
      userEmail: session.user.email,
      items: cart.map((item: CartItemPayload) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      amount: totalAmount,
      // Fix: Use 'qr-code' to match your Sales.ts Schema enum exactly
      paymentMethod: 'qr-code', 
      status: 'pending',
      createdAt: new Date(),
    });
    
    const orderId = newSale._id.toString();

    return NextResponse.json({ success: true, orderId: orderId }, { status: 201 });

  } catch (error) {
    console.error("Error in nfc-link API:", error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}