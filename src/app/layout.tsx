// src/app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
// We only need the provider component now
import NextAuthSessionProvider from '@/components/SessionProvider';

// This is no longer an 'async' function
export default function RootLayout({ children }: { children: ReactNode }) {
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
        <meta name="application-name" content="Billzzy Lite" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-TileImage" content="/assets/icon-192.png" />
        <meta name="msapplication-config" content="none" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/pwa-app.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/icon-192.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/icon-192.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/assets/icon-192.png" />
        
        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icon-192.png" />
        
        {/* Mask Icons for Safari */}
        <link rel="mask-icon" href="/assets/icon-192.png" color="#0ea5e9" />
      </head>
      <body className='bg-gray-50'>
        {/* The provider will now handle fetching the session on the client */}
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}