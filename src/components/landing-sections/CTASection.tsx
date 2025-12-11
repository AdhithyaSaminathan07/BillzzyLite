


"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp, FaPhoneAlt, FaArrowRight, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function CTASection() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const CONTACT_NUMBER = "8524089733";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 px-4 flex justify-center bg-white">

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
          <motion.button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 group focus:outline-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Left Arrow (Appears when open) - Surfaces to point down */}
            <AnimatePresence mode="popLayout">
              {open && (
                <motion.span
                  key="left-arrow"
                  initial={{ y: 40, x: 10, opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 90 }}
                  exit={{ y: 40, x: 10, opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{ duration: 0.4, ease: "backOut", delay: 0.1 }}
                  className="bg-[#5a4fcf] hover:bg-[#4a41b5] text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors shadow-lg shadow-[#5a4fcf]/30"
                >
                  <FaArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pill Text */}
            <motion.span
              layout
              className="bg-[#5a4fcf] hover:bg-[#4a41b5] text-white px-6 py-3 md:px-8 md:py-3 rounded-full font-medium text-sm md:text-base transition-colors shadow-lg shadow-[#5a4fcf]/30 whitespace-nowrap"
            >
              Contact Us now
            </motion.span>

            {/* Right Arrow (Appears when closed) - Surfaces to flat */}
            <AnimatePresence mode="popLayout">
              {!open && (
                <motion.span
                  key="right-arrow"
                  initial={{ y: 40, x: -10, opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ y: 40, x: -10, opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                  className="bg-[#5a4fcf] hover:bg-[#4a41b5] text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors shadow-lg shadow-[#5a4fcf]/30"
                >
                  <FaArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Premium Popup */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popupRef}
                className="absolute z-50 top-full mt-5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 w-80 md:w-96 origin-top"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                    <motion.a
                      href={`https://wa.me/${CONTACT_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100/80 border border-green-100 transition-all duration-200 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FaWhatsapp className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">WhatsApp</h4>
                        <p className="text-xs text-green-600 font-medium">Available now</p>
                      </div>
                      <FaExternalLinkAlt className="text-gray-300 group-hover:text-green-600 text-sm" />
                    </motion.a>

                    {/* Phone Option */}
                    <motion.a
                      href={`tel:${CONTACT_NUMBER}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-100 transition-all duration-200 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FaPhoneAlt className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Phone Call</h4>
                        <p className="text-xs text-blue-600 font-medium">Direct line</p>
                      </div>
                      <FaArrowRight className="text-gray-300 group-hover:text-blue-600 text-sm" />
                    </motion.a>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}