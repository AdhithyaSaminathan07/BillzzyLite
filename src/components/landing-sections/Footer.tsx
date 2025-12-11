
"use client";

import React from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const socialIcons = [
  {
    Icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/tech-vaseegrah/posts/?feedView=all",
    className: "hover:text-blue-300",
  },
  {
    Icon: FaFacebookF,
    href: "https://www.facebook.com/people/Tech-Vaseegrah/61558676843990/",
    className: "hover:text-blue-400",
  },
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/techvaseegrah/",
    className: "hover:text-pink-400",
  },
  {
    Icon: SiX,
    href: "https://x.com/Tech_Vaseegrah",
    className: "text-lg hover:text-gray-300",
  },
  {
    Icon: FaYoutube,
    href: "https://youtube.com/@techvaseegrah?si=rPp2emhWCnE7-57X",
    className: "hover:text-red-400",
  },
  {
    Icon: FaWhatsapp,
    href: "https://wa.me/918524089733",
    className: "hover:text-green-400",
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-12 px-6"
      style={{ backgroundColor: "#5a4fcf", color: "white" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-4">
        
        {/* --- Left Section: Brand & Description --- */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="relative w-40 h-auto">
            <Image
              src="/assets/white-logo.png"
              alt="Billzzy Lite Logo"
              width={160}
              height={50}
              className="object-contain"
            />
          </div>
          <p className="text-gray-100 text-sm leading-relaxed max-w-xs">
            Simplifying billing for businesses worldwide with smart automation and powerful features.
          </p>
        </div>

        {/* --- Center Section: Powered By --- */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
            Powered by
          </span>
          <div className="bg-white p-3 rounded-xl shadow-md transition-transform hover:scale-105">
            <Image
              src="/assets/tech-logo.png"
              alt="Tech Vaseegrah Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* --- Right Section: Contact & Socials --- */}
        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-1">Contact Us</h3>
            <a 
              href="tel:918524089733" 
              className="text-gray-100 text-lg hover:text-white transition-colors block"
            >
              📞 +91 85240 89733
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {socialIcons.map(({ Icon, href, className }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl transition-all transform hover:scale-110 ${className}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright --- */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/20 text-center text-gray-300 text-xs sm:text-sm">
        <p>© {new Date().getFullYear()} Billzzy Lite. All rights reserved.</p>
      </div>
    </footer>
  );
}