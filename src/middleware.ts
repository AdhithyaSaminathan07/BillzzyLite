// // src/middleware.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//   // --- PART 1: AUTHENTICATION & AUTHORIZATION ---

//   // Get the user's session token to check their role
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   // Check if the user is trying to access the secure admin dashboard
//   if (pathname.startsWith('/admin/dashboard')) {
//     // If they are not logged in OR they are not an admin, redirect them.
//     if (!token || token.role !== 'admin') {
//       const url = req.nextUrl.clone();
//       url.pathname = '/login'; // Redirect to your main login page
//       return NextResponse.redirect(url);
//     }
//   }

//   // --- PART 2: MULTI-TENANCY (Your Original Logic) ---
  
//   // This part runs after the security check has passed.
//   // It will add the subdomain header for all requests.
//   const hostname = req.headers.get('host');
  
//   // For local dev, you might use localhost:3000, which has no subdomain.
//   const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';

//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-tenant-id', subdomain);

//   // Continue to the requested page with the new header attached.
//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// export const config = {
//   // We keep your original matcher. The middleware will run on almost all requests,
//   // but our code inside only acts on the '/admin/dashboard' route.
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     '/api/:path*',
//   ],
// };


// // src/middleware.ts

// import { getToken } from 'next-auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Rule #1: Let all NextAuth API routes (like the Google callback) pass through.
//   // This is the critical fix to make Google login work reliably.
//   if (pathname.startsWith('/api/auth')) {
//     return NextResponse.next();
//   }

//   // --- Get User Information ---
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const isLoggedIn = !!token;
//   const isAdmin = token?.role === 'admin';

//   // --- Define Your Routes ---
//   const publicRoutes = ['/']; // Your login page is the homepage
//   const liteUserRoutes = ['/dashboard', '/billing', '/inventory', '/settings', '/pay'];
//   const adminRoutes = ['/admin', '/admin/dashboard'];

//   // --- Main Routing Logic ---

//   // Rule #2: Redirect already logged-in users away from the login page.
//   if (isLoggedIn && publicRoutes.includes(pathname)) {
//     // If they are an admin, send them to the admin dashboard.
//     if (isAdmin) {
//       return NextResponse.redirect(new URL('/admin/dashboard', req.url));
//     }
//     // Otherwise, send them to the regular user dashboard.
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   // Rule #3: Protect Admin Routes
//   if (adminRoutes.some(route => pathname.startsWith(route))) {
//     if (!isAdmin) {
//       // If a non-admin tries to access an admin page, send them away.
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }
//   }

//   // Rule #4: Protect All Private User Routes
//   if (liteUserRoutes.some(route => pathname.startsWith(route))) {
//     if (!isLoggedIn) {
//       // If a logged-out user tries to access any private page, send them to login.
//       const loginUrl = new URL('/', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // --- Multi-Tenancy Logic (Your Original Code) ---
//   // This runs after all security checks have passed.
//   const hostname = req.headers.get('host');
//   const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';
  
//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-tenant-id', subdomain);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// // The matcher configuration tells this middleware to run on almost every request.
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };


// // src/middleware.ts

// import { getToken } from 'next-auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Rule #1: Let all NextAuth API routes pass through without checks.
//   if (pathname.startsWith('/api/auth')) {
//     return NextResponse.next();
//   }

//   // --- 1. GET USER INFORMATION ---
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const isLoggedIn = !!token;
//   const isAdmin = token?.role === 'admin';

//   // --- 2. DEFINE YOUR ROUTES (THIS IS THE FIX) ---

//   // Public routes are accessible to everyone. We add '/admin' here.
//   const publicRoutes = ['/', '/admin'];

//   // Private routes for regular logged-in users.
//   const liteUserRoutes = ['/dashboard', '/billing', '/inventory', '/settings', '/pay'];

//   // ONLY the admin DASHBOARD is a private admin route. The login page is not.
//   const adminRoutes = ['/admin/dashboard'];

//   // --- Main Routing Logic ---

//   // Rule #2: Redirect already logged-in users away from login pages.
//   if (isLoggedIn && publicRoutes.includes(pathname)) {
//     // If an admin visits a public page, send them to their dashboard.
//     if (isAdmin) {
//       return NextResponse.redirect(new URL('/admin/dashboard', req.url));
//     }
//     // If a regular user visits a public page, send them to their dashboard.
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   // Rule #3: Protect Admin Routes
//   if (adminRoutes.some(route => pathname.startsWith(route))) {
//     if (!isAdmin) {
//       // If a non-admin tries to access a protected admin page, kick them out.
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }
//   }

//   // Rule #4: Protect Regular User Routes
//   if (liteUserRoutes.some(route => pathname.startsWith(route))) {
//     if (!isLoggedIn) {
//       // If a logged-out user tries to access any private user page, send them to login.
//       const loginUrl = new URL('/', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // --- 3. MULTI-TENANCY LOGIC ---
//   const hostname = req.headers.get('host');
//   const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';
  
//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-tenant-id', subdomain);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// // The matcher configuration tells this middleware to run on almost every request.
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };


// // src/middleware.ts

// import { getToken } from 'next-auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Rule #1: Always let NextAuth's own API routes (like the Google callback) pass through.
//   // This is a critical fix for social logins.
//   if (pathname.startsWith('/api/auth')) {
//     return NextResponse.next();
//   }

//   // --- 1. GET USER INFORMATION ---
//   // We get the user's session token to check if they are logged in and what their role is.
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const isLoggedIn = !!token;
//   const isAdmin = token?.role === 'admin';

//   // --- 2. DEFINE ALL YOUR ROUTE TYPES ---
//   // Public routes can be visited by anyone. These are your login pages.
//   const publicRoutes = ['/', '/admin'];

//   // Private routes for your regular SaaS users.
//   const liteUserRoutes = ['/dashboard', '/billing', '/inventory', '/settings', '/pay'];

//   // Private routes for you, the master admin.
//   const adminRoutes = ['/admin/dashboard'];

//   // --- 3. APPLY THE ROUTING RULES ---

//   // **Rule for Logged-In Users:**
//   // If a user is already logged in and tries to visit a public login page...
//   if (isLoggedIn && publicRoutes.includes(pathname)) {
//     // Special case: Allow access to /admin route for logout purposes
//     if (pathname === '/admin') {
//       // Allow access to admin login page
//     } else if (isAdmin && pathname === '/') {
//       // Only redirect admins from home page to admin dashboard
//       return NextResponse.redirect(new URL('/admin/dashboard', req.url));
//     } else if (!isAdmin && pathname === '/') {
//       // Only redirect regular users from home page to user dashboard
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }
//     // For other public routes, allow access without redirecting
//   }

//   // **Rule for Admin Routes:**
//   // If someone tries to access a protected admin page...
//   if (adminRoutes.some(route => pathname.startsWith(route))) {
//     // ...and they are NOT an admin, kick them out.
//     if (!isAdmin) {
//       return NextResponse.redirect(new URL('/dashboard', req.url)); // Send them to the user dashboard
//     }
//   }

//   // **Rule for Regular User Routes:**
//   // If someone tries to access a protected user page...
//   if (liteUserRoutes.some(route => pathname.startsWith(route))) {
//     // ...and they are NOT logged in at all, send them to the main login page.
//     if (!isLoggedIn) {
//       const loginUrl = new URL('/', req.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // --- 4. MULTI-TENANCY LOGIC ---
//   // This part runs last, only after all the security checks above have passed.
//   const hostname = req.headers.get('host');
//   const subdomain = hostname?.includes('.') ? hostname.split('.')[0] : '';
  
//   const requestHeaders = new Headers(req.headers);
//   requestHeaders.set('x-tenant-id', subdomain);

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// // This config tells the middleware to run on every page, which is what we want.
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

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