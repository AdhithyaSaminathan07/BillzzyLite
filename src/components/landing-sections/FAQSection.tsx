"use client";

import React, { useState } from "react";

// Type for FAQ item props
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={`
        mb-4 rounded-xl transition-all duration-300 ease-in-out border
        ${isOpen
          ? "bg-white border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          : "bg-gray-50 border-transparent hover:bg-gray-100"
        }
      `}
    >
      <button
        className="w-full text-left px-6 py-5 flex items-start md:items-center justify-between gap-4"
        onClick={onToggle}
      >
        <span className={`text-lg font-bold leading-snug ${isOpen ? 'text-[#5a4fcf]' : 'text-gray-900'}`}>
          {question}
        </span>

        {/* Chevron Icon */}
        <span className="flex-shrink-0 mt-1 md:mt-0">
          <svg
            className={`w-5 h-5 text-[#5a4fcf] transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>
      </button>

      <div
        className={`
          grid transition-[grid-template-rows] duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What on earth is Billzzy Lite ?",
      answer:
        "It’s the “I’m done with paper cuts and Printer nightmares” version of billing. A ridiculously simple, 100% digital invoicing sidekick made for small businesses, freelancers, and merchants who want to look pro without selling their soul to complicated software.",
    },
    {
      question: "Is it harder & How long does it takes for onboarding ?",
      answer:
        "Please. You’ll be firing off your first gorgeous bill faster than you can say. Zero tutorial needed.",
    },
    {
      question: "Do I need to buy a fancy new gadget for billing ?",
      answer:
        "Nope! Your current phone—that one with the cracked screen and 3% battery—works like magic.",
    },
    {
      question: "How much does Billzzy Lite cost ?",
      answer: `₹0.15 per bill – literally cheaper than printing a regular paper bill (paper + ink + your printer's existential crisis = easily ₹0.20–₹0.50).

The glamorous 15-paise breakup:
• 11.5 paise → Meta’s WhatsApp entry fee  
• 3.5 paise → Keeps our developers alive.`,
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-16 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">

        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Frequently asked <br />
            <span className="text-[#5a4fcf]">questions</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed text-justify">
            Can&apos;t find what you need? Don&apos;t worry, we&apos;re here to help. Our
            friendly support team is always ready to guide you and make things
            easier.
          </p>
        </div>

        {/* Right Side: FAQ List */}
        <div className="w-full lg:w-2/3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}