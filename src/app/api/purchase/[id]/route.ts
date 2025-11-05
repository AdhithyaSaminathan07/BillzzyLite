
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Purchase from "@/models/purchase";

// 🛠 Update Purchase by ID (only for the tenant)
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const tenantId = session?.user?.email;

    // Protect the route: ensure the user is authenticated
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Wait for params before using
    const { id } = await context.params;
    await dbConnect();

    const body = await req.json();
    const updated = await Purchase.findOneAndUpdate(
      { _id: id, tenantId },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { error: "Failed to update purchase" },
      { status: 500 }
    );
  }
}

// 🗑 Delete Purchase by ID (only for the tenant)
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const tenantId = session?.user?.email;

    // Protect the route: ensure the user is authenticated
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const deleted = await Purchase.findOneAndDelete({ _id: id, tenantId });

    if (!deleted) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}
