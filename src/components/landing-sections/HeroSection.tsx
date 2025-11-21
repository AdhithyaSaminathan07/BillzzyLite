"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function HeroPage() {
  return (
    <div className={poppins.className}>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#B5A8D6]">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo */}
        <div className="relative z-20 pt-10 px-6">
          <img
            src="/assets/lite-logo.png"
            alt="Billzzy Lite Logo"
            className="h-14 w-auto drop-shadow-2xl"
          />
        </div>

        {/* Centered Heading */}
        <div className="relative z-20 px-6 mt-10 flex justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#5a4fcf] drop-shadow-lg whitespace-nowrap">
            Paperless Billing.
          </h1>
        </div>

        {/* Empty Space Holder */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-6 py-8" />

        {/* ================= BUTTONS ================= */}
        <div className="relative z-20 px-6 pb-8 flex gap-3 flex-nowrap">

          {/* Learn More */}
          <button
            onClick={() =>
              document
                .getElementById("learn-more")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-1/2 min-w-[50%] inline-flex items-center justify-center px-4 py-4 
                       bg-[#5a4fcf] hover:bg-[#4c44b7] transition-all duration-300 
                       text-white text-base font-semibold rounded-xl shadow-lg 
                       transform hover:scale-105"
          >
            Learn More <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Get Started */}
          <button
            onClick={() => (window.location.href = '/login')}
            className="w-1/2 min-w-[50%] inline-flex items-center justify-center px-4 py-4 
                       bg-white hover:bg-gray-50 transition-all duration-300 
                       text-[#5a4fcf] text-base font-semibold rounded-xl shadow-lg 
                       border-2 border-[#5a4fcf] transform hover:scale-105"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>

        </div>
      </section>

      {/* ================= EMPTY SECTION ================= */}
      <section id="learn-more" className="w-full py-16 text-center px-4"></section>
    </div>
  );
}
