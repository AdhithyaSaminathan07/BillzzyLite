import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Purchase from "@/models/purchase";

// ✅ GET all purchases
export async function GET() {
  try {
    await dbConnect();
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

// ✅ POST new purchase
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newPurchase = await Purchase.create(body);
    return NextResponse.json(newPurchase);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 });
  }
}
