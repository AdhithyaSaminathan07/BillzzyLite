// // In: src/app/layout.tsx

// import './globals.css';
// import { ReactNode } from 'react';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Import authOptions
// import NextAuthSessionProvider from '@/components/SessionProvider';

// // vvv 1. ADD THE "async" KEYWORD HERE vvv
// export default async function RootLayout({ children }: { children: ReactNode }) {
  
//   // vvv 2. CALL THE FUNCTION TO CREATE THE "session" VARIABLE vvv
//   const session = await getServerSession(authOptions); // Pass authOptions

//   return (
//     <html lang="en">
//       <head>
//         <title>Billzzy Lite</title>
//         <meta name="description" content="A lightweight billing PWA" />
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#0ea5e9" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <meta name="apple-mobile-web-app-title" content="Billzzy Lite" />
//         <link rel="apple-touch-icon" href="/assets/icon-192.png" />
//         <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png" />
//         <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png" />
//       </head>
//       <body className='bg-gray-50'>
//         {/* Now this line will work because 'session' has been defined above */}
//         <NextAuthSessionProvider session={session}>
//           {children}
//         </NextAuthSessionProvider>
//       </body>
//     </html>
//   );
// }

// // src/app/layout.tsx
// import './globals.css';
// import { ReactNode } from 'react';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Ensure this path is correct
// import NextAuthSessionProvider from '@/components/SessionProvider';

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   const session = await getServerSession(authOptions);

//   return (
//     <html lang="en">
//       <head>
//         <title>Billzzy Lite</title>
//         <meta name="description" content="A lightweight billing PWA" />
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#0ea5e9" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//       </head>
//       <body className='bg-gray-50'>
//         <NextAuthSessionProvider session={session}>
//           {children}
//         </NextAuthSessionProvider>
//       </body>
//     </html>
//   );
// }

// src/app/layout.tsx
'use client';

import './globals.css';
import { ReactNode, useEffect } from 'react';
// We only need the provider component now
import NextAuthSessionProvider from '@/components/SessionProvider';
import { registerServiceWorker } from '@/lib/pwa-utils';

// This is no longer an 'async' function
export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Handle PWA installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      (window as unknown as { deferredPrompt: Event }).deferredPrompt = e;
      // Update UI to notify the user they can install the PWA
      console.log('PWA install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Billzzy Lite</title>
        <meta name="description" content="A lightweight billing PWA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Billzzy Lite" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/pwa-app.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icon-192.png" />
        {/* Add additional meta tags for better PWA support */}
        <meta name="application-name" content="Billzzy Lite" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-TileImage" content="/assets/icon-192.png" />
      </head>
      <body className='bg-gray-50'>
        {/* The provider will now handle fetching the session on the client */}
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.error('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
