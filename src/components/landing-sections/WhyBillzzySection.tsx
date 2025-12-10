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
  const FeatureCard = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div
      className="group relative h-full p-5 md:p-6 rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      style={{
        borderColor: "#e5e7eb",
        // Default shadow that looks good on white
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
      }}
    >
      {/* Hover Fill Effect (Desktop Only) */}
      <div
        className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: primaryColor }}
      />

      {/* 
         LAYOUT SWITCH:
         flex-row = Horizontal (Mobile)
         md:flex-col = Vertical (Desktop)
      */}
      <div className="relative z-10 flex flex-row md:flex-col items-center h-full">

        {/* ICON CONTAINER */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300
                     w-14 h-14 mr-4              /* Mobile: Smaller, Margin Right */
                     md:w-20 md:h-20 md:mr-0 md:mb-4 /* Desktop: Larger, Margin Bottom */
                     shadow-sm md:group-hover:shadow-md md:group-hover:scale-110"
          style={{
            backgroundColor: primaryColor, // Solid Purple background (Matches your image)
            color: "white"                 // White Icon
          }}
        >
          {/* Icon Wrapper: On Desktop Hover, it turns white with purple icon */}
          <div className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-300 md:group-hover:bg-white md:group-hover:text-[#5a4fcf]">
            <Icon size={28} className="md:w-9 md:h-9" />
          </div>
        </div>

        {/* TEXT */}
        <p className="text-lg font-bold text-gray-800 transition-colors duration-300 md:group-hover:text-white
                      text-left md:text-center w-full">
          {text}
        </p>
      </div>
    </div>
  );

  return (
    <section className={`py-16 md:py-20 bg-white ${poppins.className}`}>
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