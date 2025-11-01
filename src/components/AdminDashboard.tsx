// // src/components/AdminDashboard.tsx

// 'use client';

// import { useState, useEffect } from 'react';

// // The shape of the user data we expect from our API
// interface User {
//   _id: string;
//   name: string;
//   email: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('/api/admin/tenants');

//         if (!res.ok) {
//           throw new Error('You do not have permission to view this data.');
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         // --- THIS IS THE FIX for the ESLint error ---
//         // We safely cast 'err' to the 'Error' type to access its message.
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []); // The empty array ensures this effect runs only once on mount

//   // --- Professional Loading State ---
//   if (loading) {
//     return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
//   }

//   // --- Professional Error State ---
//   if (error) {
//     return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">Error: {error}</div>;
//   }

//   // --- Professional UI using Tailwind CSS ---
//   return (
//     <div className="overflow-hidden bg-white shadow sm:rounded-lg">
//       <div className="p-4 sm:p-6">
//         <h2 className="text-lg font-semibold leading-6 text-gray-900">User Accounts</h2>
//         <p className="mt-1 text-sm text-gray-500">A list of all the users in your application.</p>
//       </div>
//       <div className="border-t border-gray-200">
//         {users.length === 0 ? (
//           // --- Professional Empty State ---
//           <p className="py-12 text-center text-gray-500">No users have signed up yet.</p>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             {/* Professional Table Header */}
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                   User Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                   Email Address
//                 </th>
//               </tr>
//             </thead>
//             {/* Table Body */}
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <div className="text-sm text-gray-500">{user.email}</div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STEP 2: Add state for the search term ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/tenants');
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
    fetchUsers();
  }, []);

  // --- STEP 3: Create the logout handler function ---
  const handleLogout = async () => {
    await signOut({ redirect: false }); // Sign out without an automatic redirect
    router.push('/admin'); // Redirect to the admin login page
  };

  // --- STEP 4: Filter the users based on the search term ---
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">Error: {error}</div>;
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="p-4 sm:p-6">
        {/* --- Header Section with Title and Logout Button --- */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold leading-6 text-gray-900">User Accounts</h2>
            <p className="mt-1 text-sm text-gray-500">A list of all the users in your application.</p>
          </div>
          {/* --- STEP 5: Add the Logout Button UI --- */}
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {/* --- STEP 6: Add the Search Bar UI --- */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {/* --- Table Section (now uses 'filteredUsers') --- */}
      <div className="border-t border-gray-200">
        {filteredUsers.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {searchTerm ? 'No users match your search.' : 'No users have signed up yet.'}
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}