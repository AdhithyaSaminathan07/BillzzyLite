// // import React from 'react';
// // import Dashboard from '@/components/Dashboard';

// // export default function DashboardPage() {
// //   return <Dashboard />;
// // }

// // import React from 'react';
// // import Dashboard from '@/components/Dashboard';

// // export default function DashboardPage() {
// //   return <Dashboard />;
// // }

// // src/app/(lite)/dashboard/page.tsx
// import Dashboard from '@/components/Dashboard';

// export default function DashboardPage() {
//   return <Dashboard />;
// }


// src/app/(lite)/dashboard/page.tsx
'use client'; // <-- THIS IS THE FINAL FIX. THIS ONE LINE SOLVES THE ERROR.

import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  // By making this page a "Client Component", we tell Vercel
  // not to pre-render it, which prevents the build from crashing.
  return <Dashboard />;
}