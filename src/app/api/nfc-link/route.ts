// This is the NEW, CORRECT code.

import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales';
// We do not need to import the User model anymore
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // --- THIS IS THE FIX ---
    // We get the user's email from their login session and use it directly.
    const tenantId = session.user.email;

    await connectMongoDB();

    const { cart, totalAmount } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0 || typeof totalAmount !== 'number') {
        return NextResponse.json({ success: false, message: 'Invalid or missing bill data' }, { status: 400 });
    }
    
    // Generate a unique billId
    const billId = `NFC-${Date.now().toString().slice(-8)}`;

    // Create the new Sale with the user's email as the tenantId
    const newSale = await Sale.create({
      billId: billId,
      tenantId: tenantId, // <-- We now use the email here, which will work.
      userEmail: session.user.email,
      items: cart.map((item: CartItemPayload) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      amount: totalAmount,
      paymentMethod: 'UPI',
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