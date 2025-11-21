"use client";

import React from "react";
import {
  Scroll,
  Printer,
  Wrench,
  SendHorizontal,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

// Import Poppins font
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function WhyBillzzySection() {
  const primaryColor = "#5a4fcf";

  const features = [
    { icon: <Scroll size={34} color="white" />, text: "No Paper Rolls" },
    { icon: <Printer size={34} color="white" />, text: "No Printer Jams" },
    { icon: <Wrench size={34} color="white" />, text: "No Maintenance" },
    { icon: <SendHorizontal size={34} color="white" />, text: "Instant Bill Transfer" },
  ];

  return (
    <section className={`py-16 text-center bg-white ${poppins.className}`}>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold mb-12">
        <span className="text-black">Why </span>
        <span style={{ color: primaryColor }}>Billzzy Lite ?</span>
      </h2>

      {/* Carousel */}
      <div className="max-w-md mx-auto px-6">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2000 }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div
                className="flex items-center gap-6 p-4 rounded-xl shadow-lg border"
                style={{ borderColor: primaryColor + "40" }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  {feature.icon}
                </div>

                {/* Text */}
                <p className="text-xl font-semibold text-gray-700 text-left">
                  {feature.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
