// // src/lib/auth.ts

// import { NextAuthOptions } from "next-auth";
// import { AdapterUser } from "next-auth/adapters";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// import { clientPromise } from "@/lib/mongodb";
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from 'bcryptjs';

// // --- TYPE GUARD FUNCTION ---
// // This function checks if the 'user' object has our custom 'role' property.
// // It's the most reliable way to let TypeScript know the shape of the object.
// function isCustomUser(user: AdapterUser | { role: 'user' | 'admin', id: string }): user is { role: 'user' | 'admin', id: string } {
//   return 'role' in user;
// }

// export const authOptions: NextAuthOptions = {
//   adapter: MongoDBAdapter(clientPromise),

//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         if (
//           credentials.email === 'Techvaseegrah2025@gmail.com' &&
//           credentials.password === 'Vaseegrah1234'
//         ) {
//           return { id: 'master-admin-01', email: 'Techvaseegrah2025@gmail.com', role: 'admin' };
//         }
        
//         await dbConnect();
//         const user = await User.findOne({ email: credentials.email }).select('+password');
//         if (!user || !user.password) return null;
        
//         const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//         if (!isPasswordCorrect) return null;

//         return { id: user._id.toString(), email: user.email, role: user.role };
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         // --- USING THE TYPE GUARD ---
//         if (isCustomUser(user)) {
//           // If the type guard returns true, TypeScript now KNOWS
//           // that user.id and user.role exist.
//           token.id = user.id;
//           token.role = user.role;
//         } else {
//           // This block is for the Google user (AdapterUser).
//           // We look them up in the DB to get their role.
//           await dbConnect();
//           const dbUser = await User.findOne({ email: user.email });
//           if (dbUser) {
//             token.id = dbUser._id.toString();
//             token.role = dbUser.role;
//           }
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { clientPromise } from "@/lib/mongodb";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        if (
          credentials.email === 'Techvaseegrah2025@gmail.com' &&
          credentials.password === 'Vaseegrah1234'
        ) {
          return { id: 'master-admin-01', email: 'Techvaseegrah2025@gmail.com', role: 'admin' };
        }
        
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user || !user.password) return null;
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        return { id: user._id.toString(), email: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: "jwt" },
  
  // ===================================================================
  // THIS IS THE FINAL FIX FOR THE ESLINT ERRORS
  // ===================================================================
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // We tell ESLint to ignore the 'any' type on this specific line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userWithRole = user as any;

        token.id = userWithRole.id;
        if (userWithRole.role) {
          token.role = userWithRole.role;
        } else {
          await dbConnect();
          const dbUser = await User.findOne({ email: userWithRole.email });
          if (dbUser) {
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // We do the same thing here for the other two errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionToken = token as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionUser = session.user as any;

      if (sessionUser && sessionToken) {
        sessionUser.id = sessionToken.id;
        sessionUser.role = sessionToken.role;
      }
      return session;
    },
  },
  
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};