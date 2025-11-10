import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST() {
  try {
    await dbConnect();
    
    // Create a test product
    const testProduct = await Product.create({
      tenantId: "test@example.com",
      name: "Test Product",
      sku: "TEST001",
      quantity: 10,
      buyingPrice: 50,
      sellingPrice: 100,
      gstRate: 18
    });
    
    return NextResponse.json({
      message: "Test product created successfully",
      product: testProduct
    });
  } catch (error: unknown) {
    console.error("Test data creation error:", error);
    return NextResponse.json(
      { error: "Failed to create test data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get all test products
    const testProducts = await Product.find({ sku: "TEST001" });
    
    return NextResponse.json({
      message: "Test products retrieved successfully",
      count: testProducts.length,
      products: testProducts
    });
  } catch (error: unknown) {
    console.error("Test data retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve test data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    
    // Delete all test products
    const result = await Product.deleteMany({ sku: "TEST001" });
    
    return NextResponse.json({
      message: "Test products deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error: unknown) {
    console.error("Test data deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete test data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}