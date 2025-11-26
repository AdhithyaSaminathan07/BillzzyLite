// import connectMongoDB from '@/lib/mongodb';
// import Sale from '@/models/Sales';

// // Force dynamic rendering so it checks the DB every time (no caching)
// export const dynamic = 'force-dynamic';

// interface PageProps {
//   params: {
//     token: string;
//   };
// }

// export default async function PublicBillPage({ params }: PageProps) {
//   // In Next.js App Router, params are accessible directly here
//   const { token } = params;

//   await connectMongoDB();

//   // 1. Find the sale using the PUBLIC TOKEN (not the ID)
//   // We use .lean() for better performance if you don't need Mongoose document methods
//   const sale = await Sale.findOne({ publicToken: token });

//   // 2. Scenario: Bill Not Found
//   if (!sale) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//         <div className="bg-white p-8 rounded-xl shadow-md text-center">
//           <div className="text-red-500 mb-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h1 className="text-xl font-bold text-gray-900">Bill Not Found</h1>
//           <p className="text-gray-500 mt-2">This bill does not exist or the link is invalid.</p>
//         </div>
//       </div>
//     );
//   }

//   // 3. Scenario: Link Expired (Current Time > Expiry Time)
//   if (sale.expiresAt && new Date() > new Date(sale.expiresAt)) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//         <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
//           <div className="text-orange-500 mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">Link Expired</h1>
//           <p className="text-gray-600 mt-2">For security reasons, this bill link expired on {new Date(sale.expiresAt).toLocaleDateString()}.</p>
//           <p className="text-xs text-gray-400 mt-4">Please ask the merchant for a new receipt.</p>
//         </div>
//       </div>
//     );
//   }

//   // 4. Scenario: Success - Render the Bill
//   return (
//     <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-[#5a4fcf] p-6 text-center text-white">
//           <h1 className="text-2xl font-bold">Payment Receipt</h1>
//           <p className="text-indigo-100 text-sm opacity-90">Bill #{sale.billId}</p>
//         </div>

//         {/* Bill Items */}
//         <div className="p-6">
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items Purchased</div>
          
//           <div className="space-y-3 mb-6">
//             {sale.items && sale.items.length > 0 ? (
//               sale.items.map((item: any, i: number) => (
//                 <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
//                   <div>
//                     <p className="font-semibold text-gray-800">{item.name}</p>
//                     <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                   </div>
//                   <span className="font-medium text-gray-900">
//                     {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 italic">No items listed.</p>
//             )}
//           </div>

//           {/* Total Section */}
//           <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
//             <span className="text-gray-600 font-bold">Total Paid</span>
//             <span className="text-2xl font-bold text-[#5a4fcf]">
//               {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.amount)}
//             </span>
//           </div>
          
//           {/* Footer Info */}
//           <div className="mt-8 text-center space-y-1">
//              <p className="text-xs text-gray-400">
//               Paid via {sale.paymentMethod === 'qr-code' ? 'UPI/QR' : sale.paymentMethod}
//             </p>
//             <p className="text-xs text-gray-400">
//               Date: {new Date(sale.createdAt).toLocaleString()}
//             </p>
//             {sale.expiresAt && (
//               <p className="text-[10px] text-red-300 mt-2">
//                 Link expires: {new Date(sale.expiresAt).toLocaleString()}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import connectMongoDB from '@/lib/mongodb';
import Sale from '@/models/Sales';

// Force dynamic rendering so it checks the DB every time (no caching)
export const dynamic = 'force-dynamic';

// FIXED: In Next.js 15, params is a Promise
interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

// Define the shape of a cart item to avoid 'any' errors
interface SaleItem {
  name: string;
  quantity: number;
  price: number;
}

export default async function PublicBillPage(props: PageProps) {
  // FIXED: Await the params before using them
  const params = await props.params;
  const { token } = params;

  await connectMongoDB();

  // 1. Find the sale using the PUBLIC TOKEN (not the ID)
  const sale = await Sale.findOne({ publicToken: token });

  // 2. Scenario: Bill Not Found
  if (!sale) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Bill Not Found</h1>
          <p className="text-gray-500 mt-2">This bill does not exist or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // 3. Scenario: Link Expired (Current Time > Expiry Time)
  if (sale.expiresAt && new Date() > new Date(sale.expiresAt)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
          <div className="text-orange-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Link Expired</h1>
          <p className="text-gray-600 mt-2">For security reasons, this bill link expired on {new Date(sale.expiresAt).toLocaleDateString()}.</p>
          <p className="text-xs text-gray-400 mt-4">Please ask the merchant for a new receipt.</p>
        </div>
      </div>
    );
  }

  // 4. Scenario: Success - Render the Bill
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#5a4fcf] p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Payment Receipt</h1>
          <p className="text-indigo-100 text-sm opacity-90">Bill #{sale.billId}</p>
        </div>

        {/* Bill Items */}
        <div className="p-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items Purchased</div>
          
          <div className="space-y-3 mb-6">
            {sale.items && sale.items.length > 0 ? (
              sale.items.map((item: SaleItem, i: number) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No items listed.</p>
            )}
          </div>

          {/* Total Section */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
            <span className="text-gray-600 font-bold">Total Paid</span>
            <span className="text-2xl font-bold text-[#5a4fcf]">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sale.amount)}
            </span>
          </div>
          
          {/* Footer Info */}
          <div className="mt-8 text-center space-y-1">
             <p className="text-xs text-gray-400">
              Paid via {sale.paymentMethod === 'qr-code' ? 'UPI/QR' : sale.paymentMethod}
            </p>
            <p className="text-xs text-gray-400">
              Date: {new Date(sale.createdAt).toLocaleString()}
            </p>
            {sale.expiresAt && (
              <p className="text-[10px] text-red-300 mt-2">
                Link expires: {new Date(sale.expiresAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}