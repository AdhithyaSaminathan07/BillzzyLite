// src/app/(admin)/admin/dashboard/page.tsx

import AdminDashboard from '@/components/AdminDashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {session?.user?.email}</p>
      </div>
      <AdminDashboard />
    </div>
  );
}