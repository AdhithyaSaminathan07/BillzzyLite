
// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const isAdmin = token?.role === 'admin';

  const publicRoutes = ['/', '/admin'];
  const liteUserRoutes = ['/dashboard', '/billing', '/inventory', '/settings', '/pay', '/billing-history'];
  const adminRoutes = ['/admin/dashboard'];

  if (isLoggedIn && publicRoutes.includes(pathname)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (liteUserRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

