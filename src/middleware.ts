// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // --- PART 1: AUTHENTICATION & AUTHORIZATION ---

  // Get the user's session token to check their role
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access the secure admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    // If they are not logged in OR they are not an admin, redirect them.
    if (!token || token.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/login'; // Redirect to your main login page
      return NextResponse.redirect(url);
    }
  }

  // --- PART 2: MULTI-TENANCY (Your Original Logic) ---
  
  // This part runs after the security check has passed.
  // It will add the subdomain header for all requests.
  const hostname = req.headers.get('host');
  
  // For local dev, you might use localhost:3000, which has no subdomain.
  const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', subdomain);

  // Continue to the requested page with the new header attached.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // We keep your original matcher. The middleware will run on almost all requests,
  // but our code inside only acts on the '/admin/dashboard' route.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
};