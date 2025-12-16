// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import QRCode from 'react-qr-code';
// import { CreditCard, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
// import Link from 'next/link';

// type CartItem = {
//   id: number;
//   name: string;
//   quantity: number;
//   price: number;
// };

// export default function PaymentPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const orderId = params.orderId as string;
//   const amount = searchParams.get('amount') || '0';
//   const itemsParam = searchParams.get('items') || '[]';
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [merchantUpi, setMerchantUpi] = useState('');
//   const [merchantName, setMerchantName] = useState('Billzzy Lite');
//   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
//   const [isPaymentComplete, setIsPaymentComplete] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [customerPhone, setCustomerPhone] = useState('');
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
//       setItems(parsedItems);
//     } catch (e) {
//       console.error('Failed to parse items:', e);
//       setErrorMessage('Invalid order data. Please contact support.');
//     }

//     const fetchMerchantDetails = async () => {
//       try {
//         const response = await fetch('/api/merchant/details');
//         if (response.ok) {
//           const data = await response.json();
//           setMerchantUpi(data.upiId || '');
//           setMerchantName(data.name || 'Billzzy Lite');
//         } else {
//           setErrorMessage('Unable to fetch merchant details. Please try again later.');
//         }
//       } catch (error) {
//         console.error('Error fetching merchant details:', error);
//         setErrorMessage('An error occurred. Please try again later.');
//       }
//     };

//     fetchMerchantDetails();
//   }, [itemsParam]);

//   const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Order-${orderId}` : '';

//   const handlePaymentCompletion = async (method: string) => {
//     setIsProcessing(true);
//     setErrorMessage(null);

//     // Validate customer phone number
//     const phoneRegex = /^[1-9]\d{9,14}$/;
//     const formattedPhone = customerPhone.replace(/\D/g, '');
//     if (customerPhone && !phoneRegex.test(formattedPhone)) {
//       setErrorMessage('Please enter a valid WhatsApp number (e.g., 919876543210).');
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       // Record the payment
//       const response = await fetch('/api/payments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           orderId,
//           amount: parseFloat(amount),
//           paymentMethod: method,
//           customerPhone: customerPhone || undefined,
//           businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID // Add business account ID
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Payment processing failed');
//       }

//       // Send WhatsApp receipt if phone number is provided
//       if (customerPhone) {
//         const whatsappPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;
//         const templateName = method === 'upi' ? 'payment_receipt_upiii' : 'payment_receipt_card';

//         const whatsappResponse = await fetch('/api/whatsapp/send', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             messaging_product: 'whatsapp',
//             recipient_type: 'individual',
//             to: whatsappPhone,
//             type: 'template',
//             template: {
//               name: templateName,
//               language: { code: 'en' },
//               components: [
//                 {
//                   type: 'header',
//                   parameters: [{ type: 'text', text: `ORDER-${orderId.slice(0, 8)}` }],
//                 },
//                 {
//                   type: 'body',
//                   parameters: [
//                     { type: 'text', text: merchantName },
//                     { type: 'text', text: amount },
//                     { type: 'text', text: method === 'upi' ? merchantUpi : 'Card Payment' },
//                     { type: 'text', text: items.map(item => `${item.name} (x${item.quantity})`).join(', ') },
//                   ],
//                 },
//               ],
//             },
//             business_account_id: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID // Include business account ID
//           }),
//         });

//         if (!whatsappResponse.ok) {
//           const errorData = await whatsappResponse.json();
//           console.error('WhatsApp API error with business account:', {
//             error: errorData,
//             businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
//           });
//           setErrorMessage('Payment successful, but failed to send WhatsApp receipt. Please contact support.');
//         } else {
//           console.log('WhatsApp receipt sent successfully with business account:', {
//             businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
//           });
//         }
//       }

//       setIsPaymentComplete(true);
//     } catch (error) {
//       console.error('Payment processing error with business account:', {
//         error,
//         businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
//       });
//       setErrorMessage('There was an issue processing your payment. Please try again or contact support.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-indigo-600">{merchantName}</h1>
//           <p className="mt-2 text-gray-600">Order #{orderId.slice(0, 8)}</p>
//         </div>

//         {errorMessage && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
//             <p className="text-sm text-red-700">{errorMessage}</p>
//             <button
//               onClick={() => setErrorMessage(null)}
//               className="mt-2 text-sm text-red-500 hover:text-red-700"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
//           <div className="px-6 py-4 bg-indigo-600 text-white">
//             <h2 className="text-xl font-bold">Order Summary</h2>
//           </div>
//           <div className="p-6">
//             <div className="space-y-3 mb-4">
//               {items.length > 0 ? (
//                 items.map(item => (
//                   <div key={item.id} className="flex justify-between items-center border-b pb-2">
//                     <div>
//                       <p className="font-semibold">{item.name}</p>
//                       <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                     </div>
//                     <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No items available.</p>
//               )}
//             </div>
//             <div className="flex justify-between items-center pt-2 border-t">
//               <p className="text-lg font-semibold text-gray-700">Total Amount</p>
//               <p className="text-2xl font-bold text-indigo-600">₹{parseFloat(amount).toFixed(2)}</p>
//             </div>
//           </div>
//         </div>

//         {isPaymentComplete ? (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
//             <div className="flex justify-center mb-4">
//               <CheckCircle size={64} className="text-green-500" />
//             </div>
//             <h2 className="text-xl font-bold text-green-800">Payment Successful!</h2>
//             <p className="mt-2 text-green-700">Thank you for your payment. Your order has been confirmed.</p>
//             {customerPhone && (
//               <p className="mt-1 text-sm text-green-600">A receipt has been sent to your WhatsApp number.</p>
//             )}
//             <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors">
//               <ArrowLeft size={16} />
//               <span>Return to Home</span>
//             </Link>
//           </div>
//         ) : (
//           <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//             <div className="px-6 py-4 bg-gray-50 border-b">
//               <h2 className="text-lg font-semibold text-gray-800">Select Payment Method</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   WhatsApp Number (for receipt, optional)
//                 </label>
//                 <input
//                   type="tel"
//                   value={customerPhone}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
//                   placeholder="e.g. 919876543210"
//                   className="w-full rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {!paymentMethod ? (
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setPaymentMethod('upi')}
//                     className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-indigo-100 bg-indigo-50 p-4 hover:bg-indigo-100"
//                     disabled={!merchantUpi}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="40"
//                       height="40"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="text-indigo-600"
//                     >
//                       <rect width="20" height="14" x="2" y="5" rx="2" />
//                       <line x1="2" x2="22" y1="10" y2="10" />
//                     </svg>
//                     <span className="text-sm font-medium text-gray-700">UPI</span>
//                   </button>

//                   <button
//                     onClick={() => setPaymentMethod('card')}
//                     className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-purple-100 bg-purple-50 p-4 hover:bg-purple-100"
//                   >
//                     <CreditCard size={40} className="text-purple-600" />
//                     <span className="text-sm font-medium text-gray-700">Card</span>
//                   </button>
//                 </div>
//               ) : paymentMethod === 'upi' ? (
//                 <div className="space-y-4 text-center">
//                   {merchantUpi ? (
//                     <>
//                       <h3 className="font-semibold text-gray-800">Scan QR to Pay</h3>
//                       <div style={{ height: 'auto', margin: '0 auto', maxWidth: 256, width: '100%' }}>
//                         <QRCode
//                           size={256}
//                           style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
//                           value={upiQR}
//                           viewBox={`0 0 256 256`}
//                         />
//                       </div>
//                       <p className="text-sm text-gray-600">Pay to <b>{merchantUpi}</b></p>
//                       <div className="flex flex-col gap-3 pt-2">
//                         <button
//                           onClick={() => handlePaymentCompletion('upi')}
//                           className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2"
//                           disabled={isProcessing}
//                         >
//                           {isProcessing ? (
//                             <>
//                               <Loader2 size={20} className="animate-spin" />
//                               <span>Processing...</span>
//                             </>
//                           ) : (
//                             <span>I&apos;ve Completed the Payment</span>
//                           )}
//                         </button>
//                         <button
//                           onClick={() => setPaymentMethod(null)}
//                           className="text-sm text-gray-500 hover:text-gray-700"
//                         >
//                           Choose a different payment method
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <p className="text-center text-red-600">UPI ID not configured. Contact the merchant.</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-800 text-center">Enter Card Details</h3>
//                   <p className="text-sm text-gray-500 text-center">Note: Card payments are processed securely via a payment gateway. Please contact support for assistance.</p>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//                       <input
//                         type="text"
//                         placeholder="1234 5678 9012 3456"
//                         className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none focus:border-purple-500"
//                         disabled
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                         <input
//                           type="text"
//                           placeholder="MM/YY"
//                           className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none focus:border-purple-500"
//                           disabled
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                         <input
//                           type="text"
//                           placeholder="123"
//                           className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none focus:border-purple-500"
//                           disabled
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//                       <input
//                         type="text"
//                         placeholder="John Doe"
//                         className="w-full rounded-lg border-2 border-gray-200 p-2 outline-none focus:border-purple-500"
//                         disabled
//                       />
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-3 pt-2">
//                     <button
//                       onClick={() => alert('Please use a payment gateway for card payments. Contact support for assistance.')}
//                       className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center gap-2"
//                       disabled={isProcessing}
//                     >
//                       {isProcessing ? (
//                         <>
//                           <Loader2 size={20} className="animate-spin" />
//                           <span>Processing...</span>
//                         </>
//                       ) : (
//                         <span>Pay ₹{amount}</span>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => setPaymentMethod(null)}
//                       className="text-sm text-gray-500 hover:text-gray-700"
//                     >
//                       Choose a different payment method
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <p className="mt-8 text-center text-sm text-gray-500">
//           Secured by Billzzy Payments | Order ID: {orderId}
//         </p>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import QRCode from 'react-qr-code';
// import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// // Define types for our data
// type CartItem = {
//   name: string;
//   quantity: number;
//   price: number;
// };

// type OrderData = {
//   _id: string;
//   amount: number;
//   items: CartItem[];
//   status: string;
//   billId: string;
// };

// export default function PaymentPage() {
//   const params = useParams();
//   const orderId = params.orderId as string;

//   const [order, setOrder] = useState<OrderData | null>(null);
//   const [merchantName, setMerchantName] = useState('Shop');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   // --- IMPORTANT: ENTER YOUR UPI ID HERE FOR TESTING ---
//   // Since the customer cannot access your phone's settings, 
//   // we hardcode it here for this test.
//   const merchantUpi = "dhanushrajendran19@okaxis";
//   // ----------------------------------------------------

//   useEffect(() => {
//     const fetchBill = async () => {
//       try {
//         // Call the API we created in Step 1
//         const res = await fetch(`/api/public/bill/${orderId}`);
//         const data = await res.json();

//         if (data.success) {
//           setOrder(data.sale);
//           setMerchantName(data.merchantName);
//           if (data.sale.status === 'completed') {
//             setPaymentSuccess(true);
//           }
//         } else {
//           setError(data.message || 'Bill not found');
//         }
//       } catch (err: any) {
//         setError('Failed to load bill details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchBill();
//   }, [orderId]);

//   const handleConfirmPayment = async () => {
//     try {
//       // Call API to mark as paid
//       const res = await fetch(`/api/public/bill/${orderId}`, { method: 'PUT' });
//       if (res.ok) {
//         setPaymentSuccess(true);
//       }
//     } catch (err: any) {
//       alert("Could not update payment status");
//     }
//   };

//   if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
//   if (error) return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
//   if (!order) return null;

//   // Create the UPI Deep Link
//   const upiLink = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${order.amount}&cu=INR&tn=Bill-${order.billId}`;

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

//         {/* Header */}
//         <div className="bg-[#5a4fcf] p-6 text-center text-white">
//           <h1 className="text-2xl font-bold">{merchantName}</h1>
//           <p className="opacity-80">Bill #{order.billId}</p>
//         </div>

//         {paymentSuccess ? (
//           <div className="p-10 text-center">
//             <div className="flex justify-center mb-4">
//               <CheckCircle className="h-20 w-20 text-green-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Paid Successfully!</h2>
//             <p className="text-gray-500">Amount: ₹{order.amount}</p>
//           </div>
//         ) : (
//           <div className="p-6 space-y-6">
//             {/* Bill Details */}
//             <div>
//               <h3 className="font-semibold text-gray-700 mb-2 border-b pb-2">Items</h3>
//               <div className="space-y-2">
//                 {order.items.map((item, idx) => (
//                   <div key={idx} className="flex justify-between text-sm">
//                     <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
//                     <span className="font-medium">₹{item.price * item.quantity}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed">
//                 <span className="font-bold text-lg">Total to Pay</span>
//                 <span className="font-bold text-2xl text-[#5a4fcf]">₹{order.amount}</span>
//               </div>
//             </div>

//             {/* QR Code Area */}
//             <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border">
//               <div className="bg-white p-2 rounded-lg shadow-sm">
//                 <QRCode value={upiLink} size={160} />
//               </div>
//               <p className="text-xs text-gray-500">Scan to pay via UPI</p>

//               {/* Button to open UPI App directly */}
//               <a
//                 href={upiLink}
//                 className="w-full bg-[#5a4fcf] text-white font-bold py-3 rounded-xl text-center shadow-md hover:bg-[#483ebd] transition"
//               >
//                 Pay via UPI App
//               </a>
//             </div>

//             {/* Manual Confirm Button */}
//             <button
//               onClick={handleConfirmPayment}
//               className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
//             >
//               I have completed the payment
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// Define types for our data
type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderData = {
  _id: string;
  amount: number;
  items: CartItem[];
  status: string;
  billId: string;
};

export default function PaymentPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [merchantName, setMerchantName] = useState('Shop');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // --- IMPORTANT: ENTER YOUR UPI ID HERE FOR TESTING ---
  // Since the customer cannot access your phone's settings, 
  // we hardcode it here for this test.
  const merchantUpi = "dhanushrajendran19@okaxis";
  // ----------------------------------------------------

  useEffect(() => {
    const fetchBill = async () => {
      try {
        // Call the API we created in Step 1
        const res = await fetch(`/api/public/bill/${orderId}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.sale);
          setMerchantName(data.merchantName);
          if (data.sale.status === 'completed') {
            setPaymentSuccess(true);
          }
        } else {
          setError(data.message || 'Bill not found');
        }
      } catch {
        setError('Failed to load bill details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchBill();
  }, [orderId]);

  const handleConfirmPayment = async () => {
    try {
      // Call API to mark as paid
      const res = await fetch(`/api/public/bill/${orderId}`, { method: 'PUT' });
      if (res.ok) {
        setPaymentSuccess(true);
      }
    } catch {
      alert("Could not update payment status");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
  if (!order) return null;

  // Create the UPI Deep Link
  const upiLink = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${order.amount}&cu=INR&tn=Bill-${order.billId}`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#5a4fcf] p-6 text-center text-white">
          <h1 className="text-2xl font-bold">{merchantName}</h1>
          <p className="opacity-80">Bill #{order.billId}</p>
        </div>

        {paymentSuccess ? (
          <div className="p-10 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Paid Successfully!</h2>
            <p className="text-gray-500">Amount: ₹{order.amount}</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Bill Details */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 border-b pb-2">Items</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed">
                <span className="font-bold text-lg">Total to Pay</span>
                <span className="font-bold text-2xl text-[#5a4fcf]">₹{order.amount}</span>
              </div>
            </div>

            {/* QR Code Area */}
            <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCode value={upiLink} size={160} />
              </div>
              <p className="text-xs text-gray-500">Scan to pay via UPI</p>

              {/* Button to open UPI App directly */}
              <a
                href={upiLink}
                className="w-full bg-[#5a4fcf] text-white font-bold py-3 rounded-xl text-center shadow-md hover:bg-[#483ebd] transition"
              >
                Pay via UPI App
              </a>
            </div>

            {/* Manual Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
            >
              I have completed the payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
