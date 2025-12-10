// "use client";

// import React from "react";
// import {
//   Scroll,
//   Printer,
//   Wrench,
//   SendHorizontal,
// } from "lucide-react";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";

// import "swiper/css";

// // Import Poppins font
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
// });

// export default function WhyBillzzySection() {
//   const primaryColor = "#5a4fcf";

//   const features = [
//     { icon: <Scroll size={34} color="white" />, text: "No Paper Rolls" },
//     { icon: <Printer size={34} color="white" />, text: "No Printer Jams" },
//     { icon: <Wrench size={34} color="white" />, text: "No Maintenance" },
//     { icon: <SendHorizontal size={34} color="white" />, text: "Instant Bill Transfer" },
//   ];

//   return (
//     <section className={`py-16 text-center bg-white ${poppins.className}`}>
//       {/* Title */}
//       <h2 className="text-3xl md:text-4xl font-bold mb-12">
//         <span className="text-black">Why </span>
//         <span style={{ color: primaryColor }}>Billzzy Lite ?</span>
//       </h2>

//       {/* Carousel */}
//       <div className="max-w-md mx-auto px-6">
//         <Swiper
//           modules={[Autoplay]}
//           autoplay={{ delay: 2000 }}
//           loop={true}
//           spaceBetween={20}
//           slidesPerView={1}
//         >
//           {features.map((feature, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="flex items-center gap-6 p-4 rounded-xl shadow-lg border"
//                 style={{ borderColor: primaryColor + "40" }}
//               >
//                 {/* Icon */}
//                 <div
//                   className="flex items-center justify-center w-20 h-20 rounded-full"
//                   style={{ backgroundColor: primaryColor }}
//                 >
//                   {feature.icon}
//                 </div>

//                 {/* Text */}
//                 <p className="text-xl font-semibold text-gray-700 text-left">
//                   {feature.text}
//                 </p>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// }

"use client";

import React from "react";
import { Scroll, Printer, Wrench, SendHorizontal } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, Variants } from "framer-motion";

import "swiper/css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface FeatureData {
  icon: React.ElementType;
  text: string;
}

export default function WhyBillzzySection() {
  const primaryColor = "#5a4fcf";

  const features: FeatureData[] = [
    { icon: Scroll, text: "No Paper Rolls" },
    { icon: Printer, text: "No Printer Jams" },
    { icon: Wrench, text: "No Maintenance" },
    { icon: SendHorizontal, text: "Instant Bill Transfer" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  // --- RESPONSIVE CARD DESIGN ---
  // --- RESPONSIVE CARD DESIGN ---
  const FeatureCard = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <motion.div
      className="group relative h-full p-6 md:p-8 rounded-3xl border bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
      initial="initial"
      whileHover="hover"
      style={{
        borderColor: "rgba(255, 255, 255, 0.6)",
        // Glassmorphism base
        backdropFilter: "blur(10px)",
      }}
    >
      {/* 1. LIQUID LAYER (Purple Water) */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#5a4fcf]"
        variants={{
          initial: { y: "100%", borderRadius: "100% 100% 0 0" },
          hover: { y: "0%", borderRadius: "0% 0% 0 0" },
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
        style={{ transformOrigin: "bottom" }}
      />

      {/* 2. GLASS RIPPLE / SHINE (Light Refraction) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.4) 60%, transparent 80%)",
        }}
        variants={{
          initial: { x: "-100%" },
          hover: { x: "100%" },
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* 3. FLUID DISTORTION / BLUR (Subtle noise/texture overlay optional) */}
      <div className="absolute inset-0 z-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />

      {/* 4. CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* ICON CONTAINER */}
        <div className="relative mb-6">
          {/* Background Circle */}
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
            variants={{
              initial: { backgroundColor: "#5a4fcf", color: "#ffffff", scale: 1 },
              hover: { backgroundColor: "#ffffff", color: "#5a4fcf", scale: 1.1, rotate: -5 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Icon size={32} />
          </motion.div>
        </div>

        {/* TEXT */}
        <motion.p
          className="text-xl font-bold"
          variants={{
            initial: { color: "#1f2937" }, // text-gray-800
            hover: { color: "#ffffff" },
          }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );

  return (
    <section id="features" className={`py-16 md:py-20 bg-white ${poppins.className}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold"
          >
            <span className="text-black">Why </span>
            <span style={{ color: primaryColor }}>Billzzy Lite?</span>
          </motion.h2>
          <div
            className="h-1.5 w-24 mx-auto mt-4 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* --- MOBILE (Swiper) --- */}
        {/* Horizontal Layout Cards */}
        <div className="block md:hidden max-w-sm mx-auto">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={15}
            slidesPerView={1}
            className="pb-10 px-1" // Padding ensures shadow isn't cut off
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="pb-2">
                <FeatureCard icon={feature.icon} text={feature.text} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- DESKTOP (Grid) --- */}
        {/* Vertical Layout Cards with Animation */}
        <motion.div
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <FeatureCard icon={feature.icon} text={feature.text} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}