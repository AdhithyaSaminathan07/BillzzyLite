// src/app/(admin)/admin/page.tsx

import AdminLoginForm from '@/components/forms/adminloginform';

export default function AdminLoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <div>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Master Admin Portal</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}