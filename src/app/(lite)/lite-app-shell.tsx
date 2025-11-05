// src/app/(lite)/lite-app-shell.tsx
'use client';

import React, { useState } from 'react';
// Make sure these import paths are correct
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';

export default function LiteAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // This is the "shell" of your application.
  // It contains all the UI and state management.
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpe={setIsMobileOpen} 
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