"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
  const primaryColor = "#5a4fcf";
  const lightPurple = "rgba(90, 79, 207, 0.1)";
  const router = useRouter();

  const benefits = [
    "Unlimited Bills & Invoices",
    "Advanced Dashboard Analytics",
    "Inventory Management",
    "Customer Management",
    "Product Variant Support",
    "Order Status SMS Notifications",
    "Priority 24/7 Support",
  ];

  return (
    <section className="w-full py-14 px-5 bg-white text-center">

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
        <span className="text-black">Simple </span><br/>
        <span style={{ color: primaryColor }}>Transparent Pricing</span>
      </h2>

      {/* Pricing Card */}
      <div
        className="mx-auto w-full max-w-md p-5 md:p-7 rounded-3xl shadow-2xl text-left"
        style={{
          backgroundColor: lightPurple,
          border: `1px solid ${primaryColor}`,
        }}
      >
        <div>

          {/* Plan Title */}
          <h3 className="text-2xl font-bold text-black mb-1">Benefits</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Perfect for growing businesses that need unlimited scale and power.
          </p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl md:text-4xl font-extrabold text-black">₹ 0.15</span>
            <span className="text-lg md:text-xl text-gray-700"> /per bill</span>
          </div>

          {/* Benefits List */}
          <ul className="space-y-3 text-gray-800 text-base md:text-lg mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="text-lg md:text-xl leading-none mr-3"
                  style={{ color: primaryColor }}
                >
                  •
                </span>
                <span className="leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button → Goes to Login Page ('/') */}
          <button
            // onClick={() => router.push('/')}
             onClick={() => (window.location.href = "/login")}
            className="w-full py-3 md:py-4 px-6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-md hover:shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            Start Today
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}
