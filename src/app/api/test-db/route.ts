import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    
    // Get the current database name from the connection
    const dbName = mongoose.connection.name;
    
    // Get collections in the current database
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not available");
    }
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    return NextResponse.json({
      message: "Database connection test successful",
      databaseName: dbName,
      collections: collectionNames,
      connectionString: process.env.MONGODB_URI
    });
  } catch (error: unknown) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}