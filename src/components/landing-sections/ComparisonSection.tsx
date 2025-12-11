
"use client";

import React from "react";
import { Zap } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function ComparisonSection() {
  const primaryColor = "#5a4fcf";

  const comparisonData = [
    {
      expense: "Device Cost",
      paper: "₹50,000",
      billzzy: "Your Mobile",
    },
    {
      expense: "Paper Roll",
      paper: "₹0.12 - ₹0.15",
      billzzy: "-",
    },
    {
      expense: "Maintenance",
      paper: "₹0.02 - ₹0.05",
      billzzy: "-",
    },
    {
      expense: "Electric Bill",
      paper: "₹0.01 - ₹0.02",
      billzzy: "-",
    },
    {
      expense: "WhatsApp API",
      paper: "-",
      billzzy: "₹0.15",
    },
    {
      expense: "Total Per Bill",
      paper: "₹0.20 - ₹0.35+",
      billzzy: "₹0.15 Flat",
      isTotal: true,
    },
  ];

  return (
    <section id="comparison" className={`py-16 px-4 bg-white ${poppins.className}`}>
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* --- TITLE HEADER --- */}
        <div className="text-center py-8 px-4 border-b bg-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-black">Cost </span>
            <span style={{ color: primaryColor }}>Comparison</span>
          </h3>
          <p className="text-slate-500 text-sm md:text-base">
            See the clear difference in costs
          </p>
        </div>

        {/* --- TABLE --- */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            {/* Table Header */}
            <thead>
              <tr style={{ backgroundColor: primaryColor }}>
                {/* Expense Header */}
                <th className="py-4 px-4 md:px-6 text-left text-white font-semibold text-sm md:text-lg w-1/3">
                  Expense Type
                </th>
                {/* Paper Header (Border Left to separate) */}
                <th className="py-4 px-4 md:px-6 text-center text-white font-semibold text-sm md:text-lg border-l border-white/20 w-1/3">
                  Paper Bill
                </th>
                {/* Billzzy Header (Border Left to separate) */}
                <th className="py-4 px-4 md:px-6 text-center text-white font-semibold text-sm md:text-lg border-l border-white/20 w-1/3">
                  Billzzy Bill
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {comparisonData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100" // Subtle row separator
                >
                  {/* 1. Expense Name (White Background) */}
                  <td className={`py-4 px-4 md:px-6 text-slate-700 text-sm md:text-base font-medium bg-white
                    ${item.isTotal ? "font-bold text-slate-900" : ""}`}>
                    {item.expense}
                  </td>

                  {/* 2. Paper Bill (Red Background Column) */}
                  <td className={`py-4 px-4 md:px-6 text-center text-sm md:text-base font-semibold border-l border-red-100
                    bg-red-50 text-red-800
                    ${item.isTotal ? "text-lg font-bold border-t border-red-200" : ""}`}>
                    {item.paper}
                  </td>

                  {/* 3. Billzzy Bill (Green Background Column) */}
                  <td className={`py-4 px-4 md:px-6 text-center text-sm md:text-base font-semibold border-l border-emerald-100
                    bg-emerald-50 text-emerald-700
                    ${item.isTotal ? "text-lg font-bold border-t border-emerald-200" : ""}`}>
                    {item.billzzy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER --- */}
        <div className="py-5 px-4 text-center bg-white border-t border-slate-200">
          <p className="text-slate-600 text-sm md:text-base font-medium flex items-center justify-center gap-2">
            <Zap size={18} fill="#FACC15" color="#CA8A04" />
            <span>Switch to Billzzy and save huge on monthly costs!</span>
          </p>
        </div>
      </div>
    </section>
  );
}