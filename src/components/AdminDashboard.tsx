// // src/components/AdminDashboard.tsx

// 'use client';

// import { useState, useEffect } from 'react';

// // --- CHANGE #1: We define the shape of a User object ---
// interface User {
//   _id: string;
//   name: string;
//   email: string;
// }

// export default function AdminDashboard() {
//   // --- CHANGE #2: We change the state to hold an array of Users ---
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // The API URL is the same, but it now returns a list of users
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('/api/admin/tenants');

//         if (!res.ok) {
//           throw new Error('You do not have permission to view this data.');
//         }

//         const data = await res.json();
//         setUsers(data); // We save the user data to our state
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) return <p>Loading user data...</p>;
//   if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

//   return (
//     <div>
//       {users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               {/* --- CHANGE #3: We update the table headers --- */}
//               <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>User Name</th>
//               <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* --- CHANGE #4: We map over the users and display their data --- */}
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }


// src/components/AdminDashboard.tsx

'use client';

import { useState, useEffect } from 'react';

// The shape of the user data we expect from our API
interface User {
  _id: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // --- THIS IS THE FIX for the ESLint error ---
        // We safely cast 'err' to the 'Error' type to access its message.
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // The empty array ensures this effect runs only once on mount

  // --- Professional Loading State ---
  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
  }

  // --- Professional Error State ---
  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">Error: {error}</div>;
  }

  // --- Professional UI using Tailwind CSS ---
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">User Accounts</h2>
        <p className="mt-1 text-sm text-gray-500">A list of all the users in your application.</p>
      </div>
      <div className="border-t border-gray-200">
        {users.length === 0 ? (
          // --- Professional Empty State ---
          <p className="py-12 text-center text-gray-500">No users have signed up yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            {/* Professional Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email Address
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
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