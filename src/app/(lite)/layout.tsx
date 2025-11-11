// src/app/(lite)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';
import { isIOS } from '@/lib/pwa-utils';

export default function AppLayout({
  children,
}: {
  // THIS IS THE FIX: Changed 'Node' to 'ReactNode'
  children: React.ReactNode; 
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSSevice, setIsIOSSevice] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };

    // Check if it's iOS
    const checkIOS = () => {
      const ios = isIOS();
      setIsIOSSevice(ios);
    };

    checkStandalone();
    checkIOS();

    // Handle installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      <div className="flex-1 flex flex-col">
        <MobileHeader 
          onMenuClick={() => setIsMobileOpen(true)} 
        />
        {/* Added z-index to ensure content is properly layered */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-20 lg:pb-0 z-10 relative">
          {children}
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}