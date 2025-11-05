

// // // src/app/(lite)/layout.tsx
// // 'use client';

// // import React, { useState } from 'react';
// // import { Sidebar, MobileHeader } from '@/components/SideBar';
// // import { BottomNavBar } from '@/components/BottomNav';

// // export default function AppLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;  
// // }) {
// //   // 1. Manage the state for the mobile sidebar in the layout
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       {/* 2. Pass the state and setter function to the Sidebar */}
// //       <Sidebar 
// //         isMobileOpen={isMobileOpen} 
// //         setIsMobileOpen={setIsMobileOpen} 
// //       />

// //       <div className="flex-1 flex flex-col">
// //         {/* 3. Render the MobileHeader and provide a function to open the sidebar */}
// //         <MobileHeader 
// //           isMobileOpen={isMobileOpen} 
// //           onMenuClick={() => setIsMobileOpen(true)} 
// //         />
        
// //         {/* Main content with padding to avoid overlap with fixed mobile header/footer */}
// //         <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
// //           {children}
// //         </main>
// //       </div>
      
// //       <BottomNavBar />
// //     </div>
// //   );
// // }


// // src/app/(lite)/layout.tsx
// 'use client';

// import React, { useState } from 'react';
// import { Sidebar, MobileHeader } from '@/components/SideBar';
// import { BottomNavBar } from '@/components/BottomNav';

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;  
// }) {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar 
//         isMobileOpen={isMobileOpen} 
//         setIsMobileOpen={setIsMobileOpen} 
//       />

//       <div className="flex-1 flex flex-col">
//         {/* CORRECTED: Removed the isMobileOpen prop from MobileHeader */}
//         <MobileHeader 
//           onMenuClick={() => setIsMobileOpen(true)} 
//         />
        
//         <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
//           {children}
//         </main>
//       </div>
      
//       <BottomNavBar />
//     </div>
//   );
// }

// // src/app/(lite)/layout.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react'; // <-- Import useSession
// import { useRouter } from 'next/navigation'; // <-- Import useRouter
// import { Sidebar, MobileHeader } from '@/components/SideBar';
// import { BottomNavBar } from '@/components/BottomNav';

// // A loading component to show while checking the session
// function LoadingSpinner() {
//   return (
//     <div className="flex h-screen w-full items-center justify-center">
//       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
//     </div>
//   );
// }

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const { data: session, status } = useSession(); // <-- Get session status
//   const router = useRouter();

//   // This effect will run when the session status changes.
//   useEffect(() => {
//     // If the session is still loading, we don't do anything yet.
//     if (status === 'loading') {
//       return;
//     }

//     // If the user is not authenticated, redirect them to the login page.
//     if (status === 'unauthenticated') {
//       router.push('/');
//     }
//   }, [status, router]); // <-- Dependencies for the effect

//   // While the session is loading, show a loading indicator.
//   if (status === 'loading') {
//     return <LoadingSpinner />;
//   }

//   // If the user is authenticated, render the layout and the page content.
//   if (status === 'authenticated') {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <Sidebar 
//           isMobileOpen={isMobileOpen} 
//           setIsMobileOpen={setIsMobileOpen} 
//         />
//         <div className="flex-1 flex flex-col">
//           <MobileHeader 
//             onMenuClick={() => setIsMobileOpen(true)} 
//           />
//           <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
//             {children}
//           </main>
//         </div>
//         <BottomNavBar />
//       </div>
//     );
//   }

//   // If the user is not authenticated and not loading, render nothing.
//   // The useEffect hook will handle the redirect.
//   return null;
// }


// // src/app/(lite)/layout.tsx
// 'use client';

// import React, { useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// // A simple loader for the entire page
// function FullPageLoader() {
//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-gray-50">
//       <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-600"></div>
//     </div>
//   );
// }

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     // Once the session status is determined, if the user is not authenticated,
//     // redirect them to the home page.
//     if (status === 'unauthenticated') {
//       router.replace('/'); // Use 'replace' to prevent browser "back" button issues.
//     }
//   }, [status, router]);

//   // While the session is loading, show a full-page loader.
//   // This prevents the children (the dashboard) from rendering prematurely.
//   if (status === 'loading') {
//     return <FullPageLoader />;
//   }

//   // ONLY if the user is authenticated, render the children.
//   // This structure is safe and will not cause the manifest error.
//   if (status === 'authenticated') {
//     return (
//       <main className="h-screen bg-gray-50">
//         {children}
//       </main>
//     );
//   }

//   // If unauthenticated, render nothing while the redirect is in progress.
//   return null;
// }


// src/app/(lite)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Make sure these import paths are correct for your project
import { Sidebar, MobileHeader } from '@/components/SideBar'; 
import { BottomNavBar } from '@/components/BottomNav';

// A loader for the main content area
function ContentLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the session status is confirmed as 'unauthenticated', redirect to the login page.
    if (status === 'unauthenticated') {
      router.replace('/'); // Use 'replace' to prevent users from clicking "back" to a protected page.
    }
  }, [status, router]);

  // This is the SAFE WAY to build your layout.
  // We always render the full layout structure. This keeps the Next.js bundler happy.
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
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
          {/*
            Here is the key:
            - If the user is authenticated, we show the page content (`children`).
            - Otherwise, we show a loader while we wait for the redirect to happen.
            This prevents the app from crashing.
          */}
          {status === 'authenticated' ? children : <ContentLoader />}
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}