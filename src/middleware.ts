// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow API Auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 2. Allow Receipt Pages (Bypass Login)
  if (pathname.startsWith('/receipt')) {
    return NextResponse.next();
  }

  // 3. Get User Token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const isAdmin = token?.role === 'admin';

  // Define route categories
  const publicRoutes = ['/', '/admin'];
  const liteUserRoutes = ['/dashboard', '/billing', '/inventory', '/settings', '/pay', '/billing-history'];
  const adminRoutes = ['/admin/dashboard'];

  // 4. Redirect logged-in users away from the Landing Page
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 5. Protect Admin Routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 6. Protect App Routes
  if (liteUserRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 7. Handle Subdomain/Tenant logic
  const hostname = req.headers.get('host');
  const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', subdomain);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // ✅ FIXED: Added "|receipt" to the regex.
  // This forces Next.js to SKIP middleware entirely for these paths.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|receipt).*)',
  ],
};