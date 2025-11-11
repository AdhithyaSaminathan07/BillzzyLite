'use client';

import { useEffect, useState } from 'react';

export default function PWATestPage() {
  const [pwaStatus, setPwaStatus] = useState({
    isSupported: false,
    isInstalled: false,
    canInstall: false,
    serviceWorker: 'unknown'
  });

  useEffect(() => {
    // Check PWA support
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    
    // Check if installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    
    // Check service worker status
    let serviceWorkerStatus = 'unknown';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          serviceWorkerStatus = registration.active ? 'active' : 'waiting';
          setPwaStatus(prev => ({ ...prev, serviceWorker: serviceWorkerStatus }));
        }
      }).catch(() => {
        serviceWorkerStatus = 'error';
        setPwaStatus(prev => ({ ...prev, serviceWorker: serviceWorkerStatus }));
      });
    }
    
    setPwaStatus({
      isSupported,
      isInstalled,
      canInstall: false, // This would be set by beforeinstallprompt event
      serviceWorker: serviceWorkerStatus
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">PWA Test</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800">PWA Status</h2>
            <div className="mt-2 space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Supported:</span> 
                <span className={`ml-2 ${pwaStatus.isSupported ? 'text-green-600' : 'text-red-600'}`}>
                  {pwaStatus.isSupported ? 'Yes' : 'No'}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Installed:</span> 
                <span className={`ml-2 ${pwaStatus.isInstalled ? 'text-green-600' : 'text-red-600'}`}>
                  {pwaStatus.isInstalled ? 'Yes' : 'No'}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Service Worker:</span> 
                <span className={`ml-2 ${
                  pwaStatus.serviceWorker === 'active' ? 'text-green-600' : 
                  pwaStatus.serviceWorker === 'waiting' ? 'text-yellow-600' : 
                  pwaStatus.serviceWorker === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {pwaStatus.serviceWorker}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800">Manifest Check</h2>
            <p className="text-gray-700 mt-2">
              <a 
                href="/manifest.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                View Manifest File
              </a>
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-yellow-800">Installation Instructions</h2>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>On Chrome: Look for install icon in address bar</li>
              <li>On Safari: Use Share → Add to Home Screen</li>
              <li>On Firefox: Use menu → Install</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}