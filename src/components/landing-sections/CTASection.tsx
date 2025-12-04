"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function CTASection() {
  const [open, setOpen] = useState(false);

  const CONTACT_NUMBER = "8524089733";

  return (
    <section className="w-full py-14 px-4 text-center bg-white relative">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
        Let&apos;s connect there!
      </h2>

      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          px-10 py-4 rounded-xl text-white text-xl font-medium 
          bg-[#5a4fcf] hover:bg-[#4c44b7] shadow-md 
          transition-all duration-200 flex items-center justify-center mx-auto
        "
      >
        Connect Us Now
      </button>

      {/* Small Popup (NO FULL SCREEN) */}
      {open && (
        <div className="absolute left-1/2 top-28 transform -translate-x-1/2 z-50">
          <div className="bg-white w-64 rounded-2xl p-5 shadow-xl border relative">

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4 text-black">
              Connect With Us
            </h3>

            {/* Icons only */}
            <div className="flex items-center justify-center gap-6">

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CONTACT_NUMBER}`}
                target="_blank"
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-md transition-all"
              >
                <FaWhatsapp className="text-2xl" />
              </a>

              {/* Phone */}
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-md transition-all"
              >
                <FaPhoneAlt className="text-xl" />
              </a>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
