// src/lib/mongodb.ts

import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Add debugging to check the MongoDB URI
console.log('MONGODB_URI from environment:', MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define a type for our Mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Extract database name from URI
    const uri = new URL(MONGODB_URI!);
    const dbName = uri.pathname.substring(1) || 'billzzyDB'; // Default to billzzyDB if not specified
    console.log('Connecting to MongoDB database:', dbName);
    
    // Ensure the database name is explicitly set in the connection URI
    let connectionUri = MONGODB_URI!;
    if (!uri.pathname || uri.pathname === '/') {
      connectionUri = `${MONGODB_URI!.replace(/\/$/, '')}/${dbName}`;
    }
    
    console.log('Using connection URI:', connectionUri);
    
    // THIS IS THE FIX: We add '!' to tell TypeScript that MONGODB_URI is not undefined.
    console.log('Connecting to MongoDB with URI:', connectionUri);
    cached.promise = mongoose.connect(connectionUri, {
      dbName: dbName // Explicitly specify the database name
    }).then((mongooseInstance) => {
      console.log('Connected to MongoDB database:', mongooseInstance.connection.name);
      return mongooseInstance;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- This section is for the NextAuth adapter ---
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    // Extract database name from URI for the MongoClient as well
    const uri = new URL(MONGODB_URI!);
    const dbName = uri.pathname.substring(1) || 'billzzyDB';
    console.log('MongoClient connecting to database:', dbName);
    
    // Ensure the database name is explicitly set in the connection URI for MongoClient
    let connectionUri = MONGODB_URI!;
    if (!uri.pathname || uri.pathname === '/') {
      connectionUri = `${MONGODB_URI!.replace(/\/$/, '')}/${dbName}`;
    }
    
    console.log('Creating MongoClient with URI:', connectionUri);
    client = new MongoClient(connectionUri, {});
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Extract database name from URI for the MongoClient as well
  const uri = new URL(MONGODB_URI!);
  const dbName = uri.pathname.substring(1) || 'billzzyDB';
  console.log('MongoClient connecting to database:', dbName);
  
  // Ensure the database name is explicitly set in the connection URI for MongoClient
  let connectionUri = MONGODB_URI!;
  if (!uri.pathname || uri.pathname === '/') {
    connectionUri = `${MONGODB_URI!.replace(/\/$/, '')}/${dbName}`;
  }
  
  console.log('Creating MongoClient with URI:', connectionUri);
  client = new MongoClient(connectionUri, {});
  clientPromise = client.connect();
}

export { clientPromise };
export default dbConnect;