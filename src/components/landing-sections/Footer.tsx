'use client';

import React from 'react';
import Image from 'next/image';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';

const socialIcons = [
  { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/tech-vaseegrah/posts/?feedView=all', className: 'hover:text-blue-300' },
  { Icon: FaFacebookF, href: 'https://www.facebook.com/people/Tech-Vaseegrah/61558676843990/', className: 'hover:text-blue-400' },
  { Icon: FaInstagram, href: 'https://www.instagram.com/techvaseegrah/', className: 'hover:text-pink-400' },
  { Icon: SiX, href: 'https://x.com/Tech_Vaseegrah', className: 'text-lg hover:text-white' },
  { Icon: FaYoutube, href: 'https://youtube.com/@techvaseegrah?si=rPp2emhWCnE7-57X', className: 'hover:text-red-400' },
  { Icon: FaWhatsapp, href: 'https://wa.me/918524089733', className: 'hover:text-green-400' },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-10 px-6"
      style={{ backgroundColor: '#5a4fcf', color: 'white' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 
      md:grid-cols-3 gap-10 text-center md:text-left">

        {/* Logo + Description */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/assets/white-logo.png"
            alt="Billzzy Lite Logo"
            width={150}
            height={150}
            className="mb-4"
          />

          <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
            Simplifying billing for businesses worldwide with smart automation and powerful features.
          </p>

          {/* Powered By Section (Updated) */}
          <div className="flex flex-col items-center md:items-start mt-4">

            {/* Powered By Text - small white color */}
            <span className="text-white text-xs font-medium mb-1">
              Powered by
            </span>

            {/* Big Logo inside white box */}
            <div className="bg-white p-3 rounded-xl shadow-md">
              <Image
                src="/assets/tech-logo.png"
                alt="Tech Vaseegrah Logo"
                width={120}
                height={10}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>

          <p className="text-gray-200 text-sm mb-3">
            📞 85240 89733
          </p>

          <div className="flex items-center gap-4 text-gray-200">
            {socialIcons.map(({ Icon, href, className }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                className={`text-xl duration-200 ${className}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-gray-300 mt-10 text-sm">
        © 2025 Billzzy Lite. All rights reserved.
      </div>
    </footer>
  );
}
