
// import { LoginForm } from '@/components/forms/loginform'; // Adjust the import path if needed
// import Link from 'next/link';

// // This is the default export that Next.js will render for the /login route
// export default function LoginPage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
//         {/* Header Section */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Sign In to Your Account
//           </h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Or{' '}
//             <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
//               create a new account
//             </Link>
//           </p>
//         </div>

//         {/* The Login Form Component */}
//         <LoginForm />

//       </div>
//     </div>
//   );
// }


// import { LoginForm } from '@/components/forms/loginform';

// // This is the default export that Next.js will render for the root route ('/')
// export default function LoginPage() {
//   return (

       
//         <LoginForm />


//   );
// }


// In: src/app/page.tsx

'use client'; // Required to use hooks like useSearchParams

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/forms/loginform';

// This is the default export that Next.js will render for the root route ('/')
export default function HomePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // This logic checks the URL for our specific error and creates a message
  const errorMessage =
    error === "OAuthAccountNotLinked"
      ? "This email is already registered. Please sign in with your original method."
      : null;

  return (
    <div>
      {/* 
        This new div will only appear at the top of your homepage 
        when the specific sign-in error is in the URL.
      */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-md mx-auto my-4 rounded-md" role="alert">
          <p className="font-bold">Sign-in Error</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* This renders your existing LoginForm component */}
      <LoginForm />
    </div>
  );
}