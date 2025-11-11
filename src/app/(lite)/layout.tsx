// src/app/(lite)/layout.tsx
'use client';

import React, { useState } from 'react';
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  // THIS IS THE FIX: Changed 'Node' to 'ReactNode'
  children: React.ReactNode; 
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
        {/* Added proper z-index and positioning to ensure content doesn't interfere with sidebar */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-20 lg:pb-0 z-10 relative">
          {children}
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}