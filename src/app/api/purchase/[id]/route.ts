
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Purchase from "@/models/Purchase";

// 🛠 Update Purchase by ID
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // ✅ Wait for params before using
    const { id } = await context.params;
    await dbConnect();

    const body = await req.json();
    const updated = await Purchase.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { error: "Failed to update purchase" },
      { status: 500 }
    );
  }
}

// 🗑 Delete Purchase by ID (optional)
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();

    await Purchase.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}
