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
      className={`mb-4 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "bg-white border-2" : "bg-white border-b-2 border-gray-100"
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
        className={`px-4 pt-0 pb-4 text-gray-600 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
      question: "What is Billzzy Lite ?",
      answer:
        "Billzzy Lite is a streamlined, paper-free billing and invoicing SaaS solution designed for small businesses, freelancers or merchants who want to simplify their billing process and go digital.",
    },
    {
      question: "Is it difficult to get started?",
      answer:
        "Not at all! Getting started is easy. You can sign up, create your first bill, and start sharing it with customers in less than 5 minutes. No complex setup or training required.",
    },
    {
      question: "Is my data safe with Billzzy?",
      answer:
        "Yes, your data security is our top priority. We use industry-standard encryption protocols and secure servers to ensure your business and customer information is protected 24/7.",
    },
    {
      question: "Do I need a special device to use Billzzy?",
      answer:
        "No. Billzzy Lite works perfectly on your existing smartphone, tablet, or computer. Since it's a mobile-first app, your mobile is the only device you need for billing.",
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
          Can't find what you need? Don't worry, we're here to help. Our
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
