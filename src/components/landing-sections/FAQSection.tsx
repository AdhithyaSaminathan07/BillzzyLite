"use client";

import React, { useState } from "react";

// Type for FAQ item props
interface FAQItemProps {
  question: string;
  answer: string;
  primaryColor: string;
  isOpen: boolean;
  onToggle: () => void;
}

// A single component for each collapsible FAQ item
const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  primaryColor,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={`mb-4 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "bg-white border-2" : "bg-white border-b-2 border-gray-100"
        }`}
      style={{ borderColor: isOpen ? primaryColor : "transparent" }}
    >
      <button
        className="w-full text-left p-4 flex items-center justify-between font-semibold"
        onClick={onToggle}
      >
        <span className="text-gray-800 text-lg">{question}</span>

        <svg
          className={`w-6 h-6 transform transition-transform duration-300`}
          style={{
            color: primaryColor,
            transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          ></path>
        </svg>
      </button>

      <div
        className={`px-4 pt-0 pb-4 text-gray-600 transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const primaryColor = "#5a4fcf";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  interface FAQType {
    question: string;
    answer: string;
  }

  const faqs: FAQType[] = [
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
    <section className="py-16 bg-white">
      <div className="text-center mb-10 max-w-2xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-3">
          <span className="text-black">Frequently asked </span>
          <span style={{ color: primaryColor }}>questions</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg leading-relaxed">
          Can&apos;t find what you need? Don&apos;t worry, we&apos;re here to help. Our
          friendly support team is always ready to guide you and make things
          easier.
        </p>
      </div>

      <div className="mt-6 max-w-3xl mx-auto px-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            primaryColor={primaryColor}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}
