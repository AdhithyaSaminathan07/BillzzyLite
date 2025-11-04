// In: src/components/SessionProvider.tsx
'use client';

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  session?: Session | null; // This allows us to pass the session from the server
};

export default function NextAuthSessionProvider({ children, session }: Props) {
  // For Vercel and other deployments, we need to ensure the session provider
  // is properly configured with the correct base URL
  const getBasePath = () => {
    if (process.env.NEXTAUTH_URL) {
      try {
        return new URL(process.env.NEXTAUTH_URL).pathname;
      } catch {
        // Fallback if NEXTAUTH_URL is not a valid URL
        return '/api/auth';
      }
    }
    return '/api/auth';
  };
    
  return (
    <SessionProvider 
      session={session}
      basePath={getBasePath()}
    >
      {children}
    </SessionProvider>
  );
}