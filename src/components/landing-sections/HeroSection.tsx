// "use client";

// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
// });

// export default function HeroPage() {
//   return (
//     <div className={poppins.className}>
//       {/* ================= HERO SECTION ================= */}
//       <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#B5A8D6]">

//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <img
//             src="/images/hero.png"
//             alt="Background"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Logo */}
//         <div className="relative z-20 pt-10 px-6">
//           <img
//             src="/assets/lite-logo.png"
//             alt="Billzzy Lite Logo"
//             className="h-14 w-auto drop-shadow-2xl"
//           />
//         </div>

//         {/* Centered Heading */}
//         <div className="relative z-20 px-6 mt-10 flex justify-center text-center">
//           <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#5a4fcf] drop-shadow-lg whitespace-nowrap">
//             Paperless Billing.
//           </h1>
//         </div>

//         {/* Empty Space Holder */}
//         <div className="relative z-20 flex-1 flex items-center justify-center px-6 py-8" />

//         {/* ================= BUTTONS ================= */}
//         <div className="relative z-20 px-6 pb-8 flex gap-3 flex-nowrap">

//           {/* Learn More */}
//           <button
//             onClick={() =>
//               document
//                 .getElementById("learn-more")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="w-1/2 min-w-[50%] inline-flex items-center justify-center px-4 py-4 
//                        bg-[#5a4fcf] hover:bg-[#4c44b7] transition-all duration-300 
//                        text-white text-base font-semibold rounded-xl shadow-lg 
//                        transform hover:scale-105"
//           >
//             Learn More <ArrowRight className="ml-2 w-5 h-5" />
//           </button>

//           {/* Get Started */}
//           <button
//             onClick={() => (window.location.href = '/login')}
//             className="w-1/2 min-w-[50%] inline-flex items-center justify-center px-4 py-4 
//                        bg-white hover:bg-gray-50 transition-all duration-300 
//                        text-[#5a4fcf] text-base font-semibold rounded-xl shadow-lg 
//                        border-2 border-[#5a4fcf] transform hover:scale-105"
//           >
//             Get Started <ArrowRight className="ml-2 w-5 h-5" />
//           </button>

//         </div>
//       </section>

//       {/* ================= EMPTY SECTION ================= */}
//       <section id="learn-more" className="w-full py-16 text-center px-4"></section>
//     </div>
//   );
// }


"use client";

import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function HeroPage() {
  return (
    <div className={poppins.className}>

      {/* ==========================================================
          MOBILE VIEW (UNCHANGED)
      ========================================================== */}
      <section className="relative w-full min-h-screen flex md:hidden flex-col overflow-hidden bg-[#B5A8D6]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 pt-10 px-6">
          <img
            src="/assets/lite-logo.png"
            alt="Billzzy Lite Logo"
            className="h-14 w-auto drop-shadow-2xl"
          />
        </div>

        <div className="relative z-20 px-6 mt-10 flex justify-center text-center">
          <h1 className="text-4xl font-bold leading-tight text-[#4F46E5] drop-shadow-lg whitespace-nowrap">
            Paperless Billing.
          </h1>
        </div>

        <div className="relative z-20 flex-1 flex items-center justify-center px-6 py-8" />

        <div className="relative z-20 px-6 pb-8 flex gap-3 flex-nowrap">
          <button
            onClick={() =>
              document
                .getElementById("learn-more")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-1/2 inline-flex items-center justify-center px-4 py-4 
            bg-[#4F46E5] hover:bg-[#4338ca] transition-all duration-300 
            text-white text-base font-semibold rounded-xl shadow-lg 
            transform hover:scale-105"
          >
            Learn More <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          <button
            onClick={() => (window.location.href = "/login")}
            className="w-1/2 inline-flex items-center justify-center px-4 py-4 
            bg-white hover:bg-gray-50 transition-all duration-300 
            text-[#4F46E5] text-base font-semibold rounded-xl shadow-lg 
            border-2 border-[#4F46E5] transform hover:scale-105"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ==========================================================
          DESKTOP VIEW (White Background + #4F46E5 Dots)
      ========================================================== */}
      <section className="hidden md:flex flex-row items-center w-full min-h-screen relative bg-white overflow-hidden">
        
        {/* --- DECORATIVE ELEMENTS --- */}
        
        {/* 1. The Dotted Grid (Bottom Left) 
            UPDATED: text-[#4F46E5] and slightly increased opacity so color is visible */}
        <div className="absolute bottom-10 left-24 opacity-20 text-[#4F46E5]">
          <svg width="100" height="40" viewBox="0 0 100 40">
            <defs>
              <pattern id="smallDotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDotPattern)" />
          </svg>
        </div>

        {/* 2. The Geometric Cube (Top Center/Right) 
            UPDATED: Changed to match brand color lightly */}
        <div className="absolute top-10 right-[40%] opacity-20 text-[#4F46E5]">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>

        {/* --- LEFT CONTENT --- */}
        <div className="w-1/2 pl-24 pr-12 flex flex-col justify-center items-start h-full z-10">
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-snug tracking-wide text-[#332a7c]">
              Billzzy Lite:<br />
              <span className="text-[#4F46E5]">Mobile,</span><br />
              <span className="text-[#4F46E5]">Paperless,</span><br />
              <span className="text-[#332a7c]">& Green Billing.</span>
            </h1>
          </div>

          <p className="mt-4 mb-10 text-lg text-gray-600 leading-loose tracking-wide max-w-xl">
            Streamline your point of sale with our eco-friendly,
            mobile-first billing solution. Say goodbye to paper and
            hello to efficiency. Fast, secure, and sustainable for
            businesses of all sizes.
          </p>

          <div className="flex items-center gap-5">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-8 py-4 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/20 transition-transform transform hover:-translate-y-1 flex items-center tracking-wide"
            >
              Get Started
            </button>

            <button className="px-8 py-4 bg-white border border-gray-200 hover:border-[#4F46E5] text-gray-600 hover:text-[#4F46E5] font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl tracking-wide">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* --- RIGHT IMAGE WITH HOVER INTERACTION --- */}
        <div className="w-1/2 h-screen relative flex items-center justify-center p-12">
          
          {/* GROUP WRAPPER: Handles the hover state for both image and dots */}
          <div className="relative group w-full max-w-xl z-10 flex items-center justify-center">

             {/* 
                3. The Large Dotted Circle (Behind Image) 
                UPDATED: text-[#4F46E5] to match the requested color code.
             */}
             <div className="absolute w-[160%] h-[160%] -z-10 flex items-center justify-center 
                             opacity-0 group-hover:opacity-30 scale-90 group-hover:scale-100
                             transition-all duration-700 ease-in-out pointer-events-none">
                <svg width="800" height="800" viewBox="0 0 100 100" className="w-full h-full text-[#4F46E5] fill-current">
                   <defs>
                      <pattern id="dot-pattern" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                         <circle cx="1" cy="1" r="0.5" />
                      </pattern>
                      <mask id="circle-mask">
                         <circle cx="50" cy="50" r="45" fill="white" />
                      </mask>
                   </defs>
                   <rect x="0" y="0" width="100" height="100" fill="url(#dot-pattern)" mask="url(#circle-mask)" />
                </svg>
             </div>

             {/* MAIN IMAGE CARD */}
             <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
               <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-gray-100 ring-1 ring-black/5">
                 <img
                   src="/assets/desktop.png"
                   alt="Billzzy Lite Desktop Illustration"
                   className="w-full h-auto object-cover"
                 />
               </div>
             </div>

          </div>
        </div>
      </section>

      <section id="learn-more" className="w-full py-16 text-center px-4"></section>
    </div>
  );
}