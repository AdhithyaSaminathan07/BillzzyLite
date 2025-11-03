// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

import { clientPromise } from "@/lib/mongodb";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  // Use MongoDB to store user and account linking information
  adapter: MongoDBAdapter(clientPromise),

  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // This setting gracefully handles when a user tries to sign in with Google
      // using an email that is already registered with a password.
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // This function contains the logic to verify a user's password.
      async authorize(credentials) {
        // We wrap everything in a try...catch block to find hidden errors.
        try {
          if (!credentials) return null;

          // Your master admin check using environment variables.
          if (
            credentials.email === process.env.ADMIN_EMAIL &&
            credentials.password === process.env.ADMIN_PASSWORD
          ) {
            console.log("✅ Master admin credentials matched.");
            return { id: 'master-admin-01', email: process.env.ADMIN_EMAIL, role: 'admin' };
          }
          
          // Logic for regular users stored in the database.
          await dbConnect();
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user || !user.password) {
            console.log("❌ Authorize failed: User not found or has no password.");
            return null;
          }
          
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            console.log("❌ Authorize failed: Incorrect password.");
            return null;
          }

          console.log("✅ Database user login successful.");
          return { id: user._id.toString(), email: user.email, role: user.role, tenantId: user.tenantId };

        } catch (error) {
          // THIS IS THE MOST IMPORTANT PART FOR DEBUGGING.
          // If anything crashes, it will be printed in your server terminal.
          console.error("🔥 UNEXPECTED ERROR IN AUTHORIZE FUNCTION 🔥", error);
          return null;
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  // Callbacks are used to control the session token.
  callbacks: {
    // The 'jwt' callback adds information (like role and tenantId) to the token.
    async jwt({ token, user }) {
      if (user) {
        // This 'user' object comes from the 'authorize' function or Google.
        const userWithRole = user as { id: string; role: string; tenantId?: string };
        token.id = userWithRole.id;
        token.role = userWithRole.role;
        token.tenantId = userWithRole.tenantId; // This is undefined for admin, which is correct.
      }
      return token;
    },
    // The 'session' callback makes the token information available to the front-end.
    async session({ session, token }) {
      if (session.user && token) {
        const sessionUser = session.user as { id?: string; role?: string; tenantId?: string };
        sessionUser.id = token.id as string;
        sessionUser.role = token.role as string;
        sessionUser.tenantId = token.tenantId as string | undefined;
      }
      return session;
    },
  },
  
  // This tells NextAuth where your login pages are.
  // Your main login is at '/', and your admin login is at '/admin'.
  // The middleware will handle sending users to the right place.
  pages: { 
    signIn: '/',
    error: '/',
  },

  secret: process.env.NEXTAUTH_SECRET,
};