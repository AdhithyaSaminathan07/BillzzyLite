import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    pwaEnabled: true,
    manifestUrl: '/manifest.json',
    serviceWorkerUrl: '/sw.js',
    message: 'PWA is properly configured'
  });
}