// src/globals.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// --- Type declarations for next-pwa (Existing) ---
declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
  }

  export default function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}


// --- Module augmentation for `next-auth` types (New) ---
// This allows us to add custom properties to the session and user objects.
declare module 'next-auth' {
  /**
   * This is the shape of the `session` object.
   */
  interface Session {
    user: {
      id: string;
      role: string;
      tenantId?: string | null;
    } & DefaultSession['user']; // Keeps the default properties (name, email, image)
  }

  /**
   * This is the shape of the `user` object passed to callbacks.
   */
  interface User extends DefaultUser {
    role: string;
    tenantId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /** This is the shape of the JWT token. */
  interface JWT {
    id: string;
    role: string;
    tenantId?: string | null;
  }
}