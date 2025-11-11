import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Check if manifest exists
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);
    
    // Check if service worker exists
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    const swExists = await fs.access(swPath).then(() => true).catch(() => false);
    
    // Check if icons exist
    const icon192Path = path.join(process.cwd(), 'public', 'assets', 'icon-192.png');
    const icon512Path = path.join(process.cwd(), 'public', 'assets', 'icon-512.png');
    const icon192Exists = await fs.access(icon192Path).then(() => true).catch(() => false);
    const icon512Exists = await fs.access(icon512Path).then(() => true).catch(() => false);
    
    return NextResponse.json({
      status: 'success',
      manifest: {
        exists: manifestExists,
        url: '/manifest.json'
      },
      serviceWorker: {
        exists: swExists,
        url: '/sw.js'
      },
      icons: {
        '192x192': {
          exists: icon192Exists,
          url: '/assets/icon-192.png'
        },
        '512x512': {
          exists: icon512Exists,
          url: '/assets/icon-512.png'
        }
      },
      message: 'All PWA assets checked successfully'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check PWA assets',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}