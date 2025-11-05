// src/app/(lite)/layout.tsx
'use client';

import React, { useState } from 'react';
// These components are now safe to import because they are correct.
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // This is the final, correct layout.
  // It is a simple UI shell that displays your navigation.
  // Your middleware.ts file is already handling all security.
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
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}