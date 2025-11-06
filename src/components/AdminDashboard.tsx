// src/components/AdminDashboard.tsx

'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

// The shape of the user data
interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  billCount?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Create a separate function for fetching users with date filters
  const fetchUsers = async (start: string = '', end: string = '') => {
    try {
      setLoading(true);
      let url = '/api/admin/tenants';
      
      // Add date parameters if provided
      if (start || end) {
        const params = new URLSearchParams();
        if (start) params.append('startDate', start);
        if (end) params.append('endDate', end);
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('You do not have permission to view this data.');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle date filter submission
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchUsers(startDate, endDate);
  };

  // Reset filters
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    fetchUsers();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  );

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tenant Management</h2>
            <p className="text-sm text-gray-500">View tenant bill counts with date filtering</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              {/* Start Date */}
              <div className="sm:col-span-1">
                <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                  />
                </div>
              </div>
              
              {/* End Date */}
              <div className="sm:col-span-1">
                <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3 border"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="sm:col-span-2 flex items-end space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No tenants match your search.' : 'No tenants found.'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.billCount || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}