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
//       } catch {
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
//     } catch {
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


// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

// // Types
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
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   // 1️⃣ FETCH BILL DETAILS ON LOAD
//   useEffect(() => {
//     const fetchBill = async () => {
//       try {
//         const res = await fetch(`/api/public/bill/${orderId}`);
//         const data = await res.json();

//         if (data.success) {
//           setOrder(data.sale);
//           if (data.sale.status === "completed") {
//             setPaymentSuccess(true);
//           }
//         } else {
//           setError(data.message || "Bill not found");
//         }
//       } catch {
//         setError("Failed to load bill details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchBill();
//   }, [orderId]);

//   // 2️⃣ HELPER: LOAD PAYTM SCRIPT DYNAMICALLY
//   const loadPaytmScript = (mid: string) => {
//     return new Promise((resolve) => {
//       if ((window as any).Paytm && (window as any).Paytm.CheckoutJS) {
//         resolve(true); // Already loaded
//         return;
//       }
//       const script = document.createElement("script");
//       // PROD URL:
//       script.src = `https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
//       // IF TESTING, USE:
//       // script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
      
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // 3️⃣ HANDLE PAY CLICK
//   const handlePaytmPayment = async () => {
//     if (!order) return;
//     setProcessing(true);

//     try {
//       // A. Call your NEW Backend API
//       const res = await fetch("/api/payments/initiate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           billId: order.billId, // Sending Bill ID
//           amount: order.amount, // Sending Amount
//           customerId: "CUST_GUEST"
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         alert("Payment Error: " + (data.error || "Could not start payment"));
//         setProcessing(false);
//         return;
//       }

//       // B. Load Paytm Script using the MID returned from Backend
//       await loadPaytmScript(data.mid || data.provider); 

//       // C. Configure Paytm Popup
//       const config = {
//         root: "",
//         flow: "DEFAULT",
//         data: {
//           orderId: data.orderId,
//           token: data.token,
//           tokenType: "TXN_TOKEN",
//           amount: order.amount.toString(),
//         },
//         handler: {
//           transactionStatus: function (paymentStatus: any) {
//             console.log("Payment Status:", paymentStatus);
//             // If payment is successful, Paytm closes the popup automatically.
//             // You can reload page or show success message
//             window.location.reload(); 
//           },
//           notifyMerchant: function (eventName: any, data: any) {
//             console.log("Notify:", eventName, data);
//           },
//         },
//       };

//       // D. Open Popup
//       if ((window as any).Paytm && (window as any).Paytm.CheckoutJS) {
//         (window as any).Paytm.CheckoutJS.init(config)
//           .then(function onSuccess() {
//             (window as any).Paytm.CheckoutJS.invoke();
//           })
//           .catch(function onError(error: any) {
//             console.log("Paytm Init Error:", error);
//           });
//       } else {
//         alert("Failed to load payment screen. Please try again.");
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // --- RENDER UI ---

//   if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
//   if (error) return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
//   if (!order) return null;

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-[#00baf2] p-6 text-center text-white">
//           <h1 className="text-2xl font-bold">Pay Bill</h1>
//           <p className="opacity-90">Bill #{order.billId}</p>
//         </div>

//         {paymentSuccess ? (
//           <div className="p-10 text-center">
//             <div className="flex justify-center mb-4">
//               <CheckCircle className="h-20 w-20 text-green-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Paid Successfully!</h2>
//             <p className="text-gray-500">Amount Paid: ₹{order.amount}</p>
//           </div>
//         ) : (
//           <div className="p-6 space-y-6">
//             {/* Bill Summary */}
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
//                 <span className="font-bold text-lg">Total</span>
//                 <span className="font-bold text-2xl text-[#00baf2]">₹{order.amount}</span>
//               </div>
//             </div>

//             {/* PAY BUTTON */}
//             <button
//               onClick={handlePaytmPayment}
//               disabled={processing}
//               className="w-full bg-[#002e6e] hover:bg-[#00baf2] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {processing ? (
//                 <>
//                   <Loader2 className="animate-spin h-5 w-5" /> Processing...
//                 </>
//               ) : (
//                 "Pay Now Securely"
//               )}
//             </button>
            
//             <p className="text-center text-xs text-gray-400">
//               Secured by Paytm Payments
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

type OrderData = { _id: string; amount: number; status: string; billId: string; };

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/public/bill/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.sale);
          if (data.sale.status === "completed") setPaymentSuccess(true);
        } else setError(data.message || "Bill not found");
      } catch { setError("Failed to load bill"); } finally { setLoading(false); }
    };
    if (orderId) fetchBill();
  }, [orderId]);

  const verifyPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId }),
      });
      const data = await res.json();
      
      if (data.success && data.status === "PAID") {
        setPaymentSuccess(true);
        setTimeout(() => {
           router.push(`/receipt/bill/${orderId}?status=success`);
        }, 1500);
      } else {
        alert("Payment Failed");
        setProcessing(false);
      }
    } catch (e) { console.error(e); setProcessing(false); }
  };

  const handlePaytmPayment = async () => {
    if (!order) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId: order.billId,
          amount: order.amount,
          customerId: "CUST_GUEST"
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Error: " + data.error);
        setProcessing(false);
        return;
      }

      if (data.isMock) {
        console.log("⚠️ Mock Payment. Simulating success...");
        setTimeout(() => verifyPayment(), 2000);
      }
    } catch (err) { console.error(err); setProcessing(false); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#00baf2] p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Pay Bill (DEMO)</h1>
          <p className="opacity-90">Bill #{order.billId}</p>
        </div>

        {paymentSuccess ? (
          <div className="p-10 text-center">
            <div className="flex justify-center mb-4"><CheckCircle className="h-20 w-20 text-green-500 animate-bounce" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Paid Successfully!</h2>
            <p className="text-gray-500">Redirecting...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-[#00baf2]">₹{order.amount}</span>
            </div>
            <button
              onClick={handlePaytmPayment}
              disabled={processing}
              className="w-full bg-[#002e6e] hover:bg-[#00baf2] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? "Processing..." : "Pay Now (Test)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}