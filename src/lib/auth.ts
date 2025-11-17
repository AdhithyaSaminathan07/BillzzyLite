// // src/lib/auth.ts

// import { NextAuthOptions } from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from 'bcryptjs';

// import { clientPromise } from "@/lib/mongodb";
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";

// // Validate critical environment variables
// const validateEnvVars = () => {
//   const requiredVars = [
//     'NEXTAUTH_SECRET',
//     'GOOGLE_CLIENT_ID',
//     'GOOGLE_CLIENT_SECRET',
//     'MONGODB_URI'
//   ];
  
//   const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
//   if (missingVars.length > 0) {
//     console.warn('Missing environment variables:', missingVars);
//     // In development, we'll throw an error
//     // In production, we'll log but continue (to avoid crashing the app)
//     if (process.env.NODE_ENV === 'development') {
//       throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
//     }
//   }
// };

// // Run validation
// validateEnvVars();

// // Extract database name from URI for MongoDB adapter
// const MONGODB_URI = process.env.MONGODB_URI;
// const uri = new URL(MONGODB_URI!);
// const dbName = uri.pathname.substring(1) || 'billzzyDB';

// export const authOptions: NextAuthOptions = {
//   // Use MongoDB to store user and account linking information
//   adapter: process.env.MONGODB_URI ? MongoDBAdapter(clientPromise, { databaseName: dbName }) : undefined,

//   // Configure authentication providers
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       // Remove allowDangerousEmailAccountLinking to prevent conflicts
//       // This setting can cause issues with account linking in production
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       // This function contains the logic to verify a user's password.
//       async authorize(credentials) {
//         // We wrap everything in a try...catch block to find hidden errors.
//         try {
//           if (!credentials) return null;

//           // Your master admin check using environment variables.
//           if (
//             credentials.email === process.env.ADMIN_EMAIL &&
//             credentials.password === process.env.ADMIN_PASSWORD
//           ) {
//             console.log("✅ Master admin credentials matched.");
//             return { id: 'master-admin-01', email: process.env.ADMIN_EMAIL, role: 'admin' };
//           }
          
//           // Logic for regular users stored in the database.
//           await dbConnect();
//           const user = await User.findOne({ email: credentials.email }).select('+password');
          
//           if (!user || !user.password) {
//             console.log("❌ Authorize failed: User not found or has no password.");
//             return null;
//           }
          
//           const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//           if (!isPasswordCorrect) {
//             console.log("❌ Authorize failed: Incorrect password.");
//             return null;
//           }

//           console.log("✅ Database user login successful.");
//           return { id: user._id.toString(), email: user.email, role: user.role, tenantId: user.tenantId };

//         } catch (error) {
//           // THIS IS THE MOST IMPORTANT PART FOR DEBUGGING.
//           // If anything crashes, it will be printed in your server terminal.
//           console.error("🔥 UNEXPECTED ERROR IN AUTHORIZE FUNCTION 🔥", error);
//           return null;
//         }
//       }
//     })
//   ],

//   session: { strategy: "jwt" },

//   // Callbacks are used to control the session token.
//   callbacks: {
//     // The 'jwt' callback adds information (like role and tenantId) to the token.
//     async jwt({ token, user, account }) {
//       // For Google login, we need to create or find the user in our database
//       if (account && account.provider === "google" && user) {
//         try {
//           // Check if user already exists in our database
//           await dbConnect();
//           let existingUser = await User.findOne({ email: user.email });
          
//           // If user doesn't exist, create a new tenant user
//           if (!existingUser) {
//             const newUser = new User({
//               email: user.email,
//               name: user.name,
//               role: 'tenant', // Default role for Google signups
//               tenantId: null, // Will be set when tenant creates their subdomain
//             });
//             existingUser = await newUser.save();
//           }
          
//           // Add user info to token
//           token.id = existingUser._id.toString();
//           token.role = existingUser.role;
//           token.tenantId = existingUser.tenantId;
//         } catch (error) {
//           console.error("Error in JWT callback:", error);
//           // Even if there's an error, we still return the token
//           // This prevents the authentication flow from breaking completely
//         }
//       }
//       // For credentials login
//       else if (user) {
//         const userWithRole = user as { id: string; role: string; tenantId?: string };
//         token.id = userWithRole.id;
//         token.role = userWithRole.role;
//         token.tenantId = userWithRole.tenantId;
//       }
//       return token;
//     },
//     // The 'session' callback makes the token information available to the front-end.
//     async session({ session, token }) {
//       if (session.user && token) {
//         const sessionUser = session.user as { id?: string; role?: string; tenantId?: string };
//         sessionUser.id = token.id as string;
//         sessionUser.role = token.role as string;
//         sessionUser.tenantId = token.tenantId as string | undefined;
//       }
//       return session;
//     },
//   },
  
//   // This tells NextAuth where your login pages are.
//   // Your main login is at '/', and your admin login is at '/admin'.
//   // The middleware will handle sending users to the right place.
//   pages: { 
//     signIn: '/',
//     error: '/',
//   },

//   secret: process.env.NEXTAUTH_SECRET,
  
//   // Vercel-specific configuration
//   ...(process.env.VERCEL_URL && {
//     redirectProxyUrl: `https://${process.env.VERCEL_URL}`,
//   }),
  
//   // Debug configuration to help with troubleshooting
//   debug: process.env.NODE_ENV === 'development',
  
//   // Events for logging
//   events: {
//     signIn: async (message) => {
//       console.log("Sign in event:", message);
//     },
//     signOut: async (message) => {
//       console.log("Sign out event:", message);
//     },
//     createUser: async (message) => {
//       console.log("Create user event:", message);
//     },
//     linkAccount: async (message) => {
//       console.log("Link account event:", message);
//     },
//     session: async (message) => {
//       console.log("Session event:", message);
//     },
//   },
// };


// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters"; // STEP 1: IMPORT ADAPTER
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

import { clientPromise } from "@/lib/mongodb";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Validate environment variables
const validateEnvVars = () => {
  const requiredVars = [ 'NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'MONGODB_URI' ];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};
validateEnvVars();

// Extract database name
const MONGODB_URI = process.env.MONGODB_URI;
const uri = new URL(MONGODB_URI!);
const dbName = uri.pathname.substring(1) || 'billzzyDB';

export const authOptions: NextAuthOptions = {
  // STEP 2: APPLY THE TYPE ASSERTION
  adapter: MongoDBAdapter(clientPromise, { databaseName: dbName }) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;

          if (credentials.email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
            return { id: 'master-admin-01', email: process.env.ADMIN_EMAIL, role: 'admin' };
          }
          
          await dbConnect();
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user || !user.password) return null;
          
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) return null;

          return { id: user._id.toString(), email: user.email, name: user.name, role: user.role, tenantId: user.tenantId };
        } catch (error) {
          console.error("🔥 UNEXPECTED ERROR IN AUTHORIZE FUNCTION 🔥", error);
          return null;
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
      }
      return session;
    },
  },
  
  pages: { 
    signIn: '/',
    error: '/',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};