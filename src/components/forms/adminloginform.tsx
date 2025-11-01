// src/components/forms/adminloginform.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false, // Important: We handle the redirect ourselves
        email,
        password,
      });

      if (result?.error) {
        // Handle login errors (e.g., wrong password)
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else if (result?.ok) {
        // On success, redirect to the admin dashboard
        router.push('/admin/dashboard');
        router.refresh(); // Clears cache and ensures user data is fresh
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '300px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email</label>
        <input name="email" type="email" required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password</label>
        <input name="password" type="password" required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}