// "use client";

// import React, { useState } from "react";
// import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

// export default function CTASection() {
//   const [open, setOpen] = useState(false);

//   const CONTACT_NUMBER = "8524089733";

//   return (
//     <section className="w-full py-14 px-4 text-center bg-white relative">
//       <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
//         Let&apos;s connect there!
//       </h2>

//       {/* Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className="
//           px-10 py-4 rounded-xl text-white text-xl font-medium 
//           bg-[#5a4fcf] hover:bg-[#4c44b7] shadow-md 
//           transition-all duration-200 flex items-center justify-center mx-auto
//         "
//       >
//         Connect Us Now
//       </button>

//       {/* Small Popup (NO FULL SCREEN) */}
//       {open && (
//         <div className="absolute left-1/2 top-28 transform -translate-x-1/2 z-50">
//           <div className="bg-white w-64 rounded-2xl p-5 shadow-xl border relative">

//             {/* Close Button */}
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
//             >
//               ×
//             </button>

//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Connect With Us
//             </h3>

//             {/* Icons only */}
//             <div className="flex items-center justify-center gap-6">

//               {/* WhatsApp */}
//               <a
//                 href={`https://wa.me/${CONTACT_NUMBER}`}
//                 target="_blank"
//                 className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-md transition-all"
//               >
//                 <FaWhatsapp className="text-2xl" />
//               </a>

//               {/* Phone */}
//               <a
//                 href={`tel:${CONTACT_NUMBER}`}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-md transition-all"
//               >
//                 <FaPhoneAlt className="text-xl" />
//               </a>

//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }


"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp, FaPhoneAlt, FaArrowRight, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

export default function CTASection() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const CONTACT_NUMBER = "8524089733";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 px-4 flex justify-center bg-white">

      {/* Defined Keyframes directly in a standard style tag to avoid parser errors */}
      <style>{`
        @keyframes customFadeIn {
          0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Main Bar Container - Flattened classNames to single line */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 border border-gray-100 z-10">

        {/* Left Text */}
        <div className="w-full md:w-auto text-center md:text-left md:pl-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a4fcf]">
            Let&apos;s connect there
          </h2>
        </div>

        {/* Right Actions Wrapper */}
        <div className="relative w-full md:w-auto flex flex-col items-center md:items-end md:pr-2">

          {/* Main Trigger Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 group transition-all active:scale-95 focus:outline-none"
          >
            {/* Pill Text */}
            <span className="bg-[#5a4fcf] hover:bg-[#4a41b5] text-white px-6 py-3 md:px-8 md:py-3 rounded-full font-medium text-sm md:text-base transition-colors shadow-lg shadow-[#5a4fcf]/30 whitespace-nowrap">
              Contact Us now
            </span>

            {/* Circle Arrow */}
            <span className="bg-[#5a4fcf] hover:bg-[#4a41b5] text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors shadow-lg shadow-[#5a4fcf]/30">
              <FaArrowRight className={`group-hover:translate-x-1 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
            </span>
          </button>

          {/* Premium Popup */}
          {open && (
            <div
              ref={popupRef}
              className="absolute z-50 top-full mt-5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 w-80 md:w-96 origin-top"
              style={{ animation: 'customFadeIn 0.3s ease-out forwards' }}
            >
              {/* Card Body */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(90,79,207,0.3)] border border-gray-100 ring-1 ring-black/5 flex flex-col gap-4 relative overflow-hidden">

                {/* Decorative Background Blur Blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Get in touch</h3>
                    <p className="text-sm text-gray-500">We typically reply within 5 mins.</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* Actions Grid */}
                <div className="flex flex-col gap-3 z-10">

                  {/* WhatsApp Option */}
                  <a
                    href={`https://wa.me/${CONTACT_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100/80 border border-green-100 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FaWhatsapp className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">WhatsApp</h4>
                      <p className="text-xs text-green-600 font-medium">Available now</p>
                    </div>
                    <FaExternalLinkAlt className="text-gray-300 group-hover:text-green-600 text-sm" />
                  </a>

                  {/* Phone Option */}
                  <a
                    href={`tel:${CONTACT_NUMBER}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-100 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FaPhoneAlt className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Phone Call</h4>
                      <p className="text-xs text-blue-600 font-medium">Direct line</p>
                    </div>
                    <FaArrowRight className="text-gray-300 group-hover:text-blue-600 text-sm" />
                  </a>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}