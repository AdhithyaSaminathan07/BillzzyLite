// src/app/(lite)/client-boundary.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Ensure these paths are correct for your project
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';

// A loader to show while we check for a valid session
function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );
}

export default function ClientBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If we confirm the user is not logged in, redirect them.
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // While the session is being checked, show the loader.
  if (status === 'loading') {
    return <FullPageLoader />;
  }

  // ONLY when the user is authenticated, render the full application UI.
  if (status === 'authenticated') {
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

  // If unauthenticated, render nothing while the redirect happens.
  return null;
}