// import { NextResponse } from 'next/server';
// import connectMongoDB from '@/lib/mongodb';
// import Sale from '@/models/Sales';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from '@/lib/auth';
// import crypto from 'crypto'; // ✅ Import this

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.email) {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//     await connectMongoDB();
//     const { cart, totalAmount } = await request.json();

//     if (!cart || !Array.isArray(cart) || cart.length === 0) {
//         return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
//     }
    
//     // ✅ 1. Generate Random Token (Hex string)
//     const randomToken = crypto.randomBytes(16).toString('hex');

//     // ✅ 2. Set Expiration (Current Time + 24 Hours)
//     const expiryDate = new Date();
//     expiryDate.setHours(expiryDate.getHours() + 24);

//     // 3. Create Sale
//     await Sale.create({
//       billId: `NFC-${Date.now().toString().slice(-8)}`,
//       tenantId: session.user.email,
//       items: cart.map((item: any) => ({
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//       })),
//       amount: totalAmount,
//       paymentMethod: 'qr-code', 
//       status: 'pending',
//       createdAt: new Date(),
      
//       // ✅ Save the token and expiration
//       publicToken: randomToken,
//       expiresAt: expiryDate
//     });
    
//     // ✅ Return the TOKEN, not the DB ID
//     return NextResponse.json({ success: true, orderId: randomToken }, { status: 201 });

//   } catch (error) {
//     console.error("Error in nfc-link API:", error);
//     return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    const { cart, totalAmount } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }
    
    // 1. Generate Random Token (Hex string)
    const randomToken = crypto.randomBytes(16).toString('hex');

    // 2. Set Expiration (Current Time + 24 Hours)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // 3. Create Sale
    await Sale.create({
      billId: `NFC-${Date.now().toString().slice(-8)}`,
      tenantId: session.user.email,
      // FIX: Replaced 'any' with typed object
      items: cart.map((item: CartItem) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      amount: totalAmount,
      paymentMethod: 'qr-code', 
      status: 'pending',
      createdAt: new Date(),
      
      // Save the token and expiration
      publicToken: randomToken,
      expiresAt: expiryDate
    });
    
    // Return the TOKEN, not the DB ID
    return NextResponse.json({ success: true, orderId: randomToken }, { status: 201 });

  } catch (error) {
    console.error("Error in nfc-link API:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}