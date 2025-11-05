// // In: src/components/SessionProvider.tsx
// 'use client';

// import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
// import React from "react";

// type Props = {
//   children?: React.ReactNode;
//   session?: Session | null; // This allows us to pass the session from the server
// };

// export default function NextAuthSessionProvider({ children, session }: Props) {
//   // For Vercel and other deployments, we need to ensure the session provider
//   // is properly configured with the correct base URL
//   const getBasePath = () => {
//     // In Vercel deployments, we should use the Vercel URL if available
//     if (process.env.NEXT_PUBLIC_VERCEL_URL) {
//       return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth`;
//     }
    
//     // Use NEXTAUTH_URL if explicitly set
//     if (process.env.NEXTAUTH_URL) {
//       try {
//         return new URL(process.env.NEXTAUTH_URL).pathname;
//       } catch {
//         // Fallback if NEXTAUTH_URL is not a valid URL
//         return '/api/auth';
//       }
//     }
    
//     // Default fallback
//     return '/api/auth';
//   };
    
//   return (
//     <SessionProvider 
//       session={session}
//       basePath="/api/auth"
//     >
//       {children}
//     </SessionProvider>
//   );
// }


// src/components/SessionProvider.tsx
'use client';

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
};

export default function NextAuthSessionProvider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}