import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales';
import User from '@/models/User'; // <-- Import the User model
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

    await connectMongoDB();

    // Step 1: Find the logged-in user to get their tenantId
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.tenantId) {
      return NextResponse.json({ success: false, message: 'User or tenant not found.' }, { status: 404 });
    }
    const tenantId = user.tenantId;

    const { cart, totalAmount } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0 || typeof totalAmount !== 'number') {
        return NextResponse.json({ success: false, message: 'Invalid or missing bill data' }, { status: 400 });
    }
    
    // Step 2: Generate a unique billId
    const billId = `NFC-${Date.now().toString().slice(-8)}`; // Example: NFC-12345678

    // Step 3: Create the new Sale document with all required fields
    const newSale = await Sale.create({
      billId: billId,           // <-- FIX: Added required billId
      tenantId: tenantId,         // <-- FIX: Added required tenantId
      userEmail: session.user.email,
      items: cart.map((item: CartItemPayload) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      amount: totalAmount,
      paymentMethod: 'UPI',       // <-- FIX: Use a valid enum value like 'UPI'
      status: 'pending',          // Use 'status' to track if it's paid
      createdAt: new Date(),
    });
    
    const orderId = newSale._id.toString();

    return NextResponse.json({ success: true, orderId: orderId }, { status: 201 });

  } catch (error) {
    console.error("Error in nfc-link API:", error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}