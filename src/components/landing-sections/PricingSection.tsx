// "use client";
// import React from 'react';
// import { useRouter } from 'next/navigation';

// export default function PricingSection() {
//   const primaryColor = "#5a4fcf";
//   const lightPurple = "rgba(90, 79, 207, 0.1)";
//   const router = useRouter();

//   const benefits = [
//     "Unlimited Bills & Invoices",
//     "Advanced Dashboard Analytics",
//     "Inventory Management",
//     "Customer Management",
//     "Product Variant Support",
//     "Order Status SMS Notifications",
//     "Priority 24/7 Support",
//   ];

//   return (
//     <section className="w-full py-14 px-5 bg-white text-center">

//       {/* Title */}
//       <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
//         <span className="text-black">Simple </span><br/>
//         <span style={{ color: primaryColor }}>Transparent Pricing</span>
//       </h2>

//       {/* Pricing Card */}
//       <div
//         className="mx-auto w-full max-w-md p-5 md:p-7 rounded-3xl shadow-2xl text-left"
//         style={{
//           backgroundColor: lightPurple,
//           border: `1px solid ${primaryColor}`,
//         }}
//       >
//         <div>

//           {/* Plan Title */}
//           <h3 className="text-2xl font-bold text-black mb-1">Benefits</h3>

//           {/* Description */}
//           <p className="text-gray-600 text-sm md:text-base mb-6">
//             Perfect for growing businesses that need unlimited scale and power.
//           </p>

//           {/* Price */}
//           <div className="mb-6">
//             <span className="text-3xl md:text-4xl font-extrabold text-black">₹ 0.15</span>
//             <span className="text-lg md:text-xl text-gray-700"> /per bill</span>
//           </div>

//           {/* Benefits List */}
//           <ul className="space-y-3 text-gray-800 text-base md:text-lg mb-8">
//             {benefits.map((benefit, index) => (
//               <li key={index} className="flex items-start">
//                 <span
//                   className="text-lg md:text-xl leading-none mr-3"
//                   style={{ color: primaryColor }}
//                 >
//                   •
//                 </span>
//                 <span className="leading-snug">{benefit}</span>
//               </li>
//             ))}
//           </ul>

//           {/* CTA Button → Goes to Login Page ('/') */}
//           <button
//             // onClick={() => router.push('/')}
//              onClick={() => (window.location.href = "/login")}
//             className="w-full py-3 md:py-4 px-6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-md hover:shadow-xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             Start Today
//             <svg
//               className="w-5 h-5 ml-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//               />
//             </svg>
//           </button>

//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaArrowRight, FaBolt } from "react-icons/fa";

export default function PricingSection() {
  const router = useRouter();

  // All benefits are now treated as "Premium/Active"
  const benefits = [
    "Unlimited Bills & Invoices",
    "Advanced Dashboard Analytics",
    "Inventory & Stock Management",
    "Customer Management (CRM)",
    "Product Variant Support",
    "WhatsApp & SMS Notifications",
    "Priority 24/7 Support",
  ];

  return (
    <section className="relative w-full py-16 md:py-32 px-4 overflow-hidden bg-white">

      {/* 1. CSS Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1s;
        }
      `}</style>

      {/* 2. Background Flow (Gradients) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Purple Blob */}
        <div className="absolute top-0 right-0 md:top-[-10%] md:right-[-5%] w-64 h-64 md:w-[500px] md:h-[500px] bg-[#5a4fcf]/20 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob"></div>
        {/* Blue Blob */}
        <div className="absolute bottom-0 left-0 md:bottom-[-10%] md:left-[-10%] w-72 h-72 md:w-[600px] md:h-[600px] bg-blue-200/40 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 relative z-10">

        {/* LEFT SIDE: Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#5a4fcf] font-semibold text-xs uppercase tracking-wide mb-4 md:mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#5a4fcf] animate-pulse"></span>
            No subscriptions
          </div>

          <h2 className="text-3xl md:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight tracking-tight">
            Simple, <br />
            {/* Gradient Text Flow */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a4fcf] to-[#8c82fc]">
              Transparent Pricing
            </span>
          </h2>

          <p className="text-gray-600 text-base md:text-xl mb-6 md:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Stop paying monthly fees for software you barely use.
            With BillzzyLite, you only pay when you make a sale.
            <span className="block mt-2 font-medium text-gray-900">It&apos;s cheaper than paper and ink.</span>
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs md:text-sm text-gray-500 mb-8 lg:mb-0">
            <div className="flex items-center gap-1">
              <FaBolt className="text-yellow-400" />
              <span>Instant Setup</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div>No Credit Card Required</div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div>Cancel Anytime</div>
          </div>
        </div>

        {/* RIGHT SIDE: The Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end px-2 md:px-0">

          {/* Floating Animation Wrapper */}
          <div className="relative group w-full max-w-md md:animate-float">

            {/* Outer Glow (Color Flow Behind Card) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5a4fcf] via-[#7d73e6] to-blue-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

            {/* The White Card */}
            <div className="relative bg-white rounded-3xl p-6 md:p-10 border border-[#5a4fcf]/10 shadow-2xl flex flex-col h-full">

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">Pay-as-you-go</h3>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">For businesses of all sizes</p>
                </div>
                {/* Badge with consistent gradient */}
                <div className="bg-gradient-to-r from-[#5a4fcf] to-[#8c82fc] text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-lg shadow-purple-500/30">
                  BEST VALUE
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tighter">₹0.15</span>
                  <span className="text-lg md:text-xl text-gray-500 font-medium">/ bill</span>
                </div>
                <div className="mt-2 md:mt-3 inline-block bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold border border-green-100">
                  Save 60% vs Paper Bills
                </div>
              </div>

              {/* Gradient Divider */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#5a4fcf]/20 to-transparent mb-6 md:mb-8"></div>

              {/* Features List - ALL MARKED */}
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">

                    {/* 3. Gradient Checkmark Icons */}
                    <div className="mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-[#5a4fcf] to-[#8c82fc] flex items-center justify-center shadow-sm">
                      <FaCheck className="text-white text-[9px] md:text-[10px]" />
                    </div>

                    {/* Text is now dark and legible for all */}
                    <span className="text-sm md:text-base leading-snug text-gray-800 font-medium">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - Consistent Flow */}
              <button
                onClick={() => router.push('/login')}
                className="
                  w-full py-3 md:py-4 px-6 rounded-2xl font-bold text-base md:text-lg text-white 
                  bg-gradient-to-r from-[#5a4fcf] to-[#4c42b3] 
                  shadow-xl shadow-purple-500/20 
                  flex items-center justify-center gap-2 
                  transition-all duration-300 transform md:hover:-translate-y-1 active:scale-95 
                  relative overflow-hidden group
                "
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />

                <span className="relative z-10 flex items-center gap-2">
                  Start Billing Now <FaArrowRight className="text-xs md:text-sm" />
                </span>
              </button>

              <p className="text-center text-gray-400 text-[10px] md:text-xs mt-4 md:mt-5">
                100% Free to sign up. No credit card needed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}