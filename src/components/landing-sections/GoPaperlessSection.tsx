'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export default function GoPaperlessSection() {
  return (
    <section className={`w-full pt-10 pb-6 px-6 ${poppins.className}`}>
      <div className="max-w-[600px] mx-auto text-center">

        {/* Heading */}
        <h2 className="text-[28px] md:text-[34px] font-semibold leading-tight mb-3">
          <span className="block md:inline">Go Paperless</span>
          <span className="block md:inline text-[#5a4fcf] md:ml-2 text-[30px] md:text-[38px] font-bold">
            With Billzzy Lite
          </span>
        </h2>

        {/* Image — bigger but no extra spacing */}
        <div className=" flex justify-center">
          <img
            src="/images/paper-lesss.png"
            alt="Go Paperless"
            className="w-[100%] md:w-[75%] h-auto object-contain -mt-2 -mb-1" 
            
          />
        </div>

        {/* Text */}
        <p className="text-gray-600 text-[16px] leading-relaxed mb-6 px-3">
          Go green with Billzzy. Switch to WhatsApp billing to reduce paper
          waste, deliver instant receipts, and present your business as modern,
          eco-friendly, and tech-savvy.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className="flex items-center justify-center gap-2 w-[200px] py-3 
                       bg-[#5a4fcf] text-white rounded-xl font-medium
                       text-[16px] hover:bg-[#4c44b7] transition-all"
          >
            Go Paperless
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
