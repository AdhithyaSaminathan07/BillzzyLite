// "use client";

// import React from "react";

// type Testimonial = {
//   id: number;
//   quote: string;
//   author: string;
//   title: string;
//   rating: number;
// };

// type StarProps = {
//   rating: number;
// };

// export default function TestimonialsSection() {
//   const primaryColor = "#5a4fcf";

//   const testimonials: Testimonial[] = [
//     {
//       id: 1,
//       quote:
//         "Our attendance management has never been this smooth! The face recognition system is fast, accurate, and secure.",
//       author: "Khesav Raj",
//       title: "Co-founder of Jhonsans",
//       rating: 5,
//     },
//     {
//       id: 2,
//       quote:
//         "Billzzy Lite has transformed how we handle invoices. Very intuitive and saves us so much time.",
//       author: "Jane Doe",
//       title: "Small Business Owner",
//       rating: 4,
//     },
//     {
//       id: 3,
//       quote:
//         "The instant bill transfer feature is a game-changer. Everything is digital and super smooth!",
//       author: "John Smith",
//       title: "Freelance Consultant",
//       rating: 5,
//     },
//     {
//       id: 4,
//       quote:
//         "Using Billzzy cut our transaction time by 50%. The analytics dashboard is extremely useful.",
//       author: "Sarah Connor",
//       title: "Retail Manager",
//       rating: 5,
//     },
//   ];

//   const StarRating = ({ rating }: StarProps) => {
//     return (
//       <div className="flex justify-start mb-4">
//         {[...Array(5)].map((_, i) => (
//           <svg
//             key={i}
//             className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"
//               }`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <section className="w-full py-16 bg-white overflow-hidden">
//       <div className="text-center mb-12">
//         <p
//           className="text-sm font-bold tracking-widest uppercase mb-2"
//           style={{ color: primaryColor }}
//         >
//           Testimonials
//         </p>

//         <h2 className="text-4xl font-extrabold leading-snug text-black">
//           <span className="text-black">What Our Happy </span>
//           <span className="text-[#5a4fcf] block">Users Say</span>
//         </h2>
//       </div>

//       <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar px-4 md:px-8 lg:px-12">
//         {testimonials.map((testimonial) => (
//           <div
//             key={testimonial.id}
//             className="flex-none w-11/12 md:w-1/2 lg:w-1/3 p-4 snap-center"
//           >
//             <div
//               className="bg-white p-8 pt-12 rounded-xl shadow-lg border relative flex flex-col justify-between h-[360px]"
//               style={{
//                 borderColor: primaryColor,
//                 backgroundColor: "rgba(90, 79, 207, 0.05)",
//               }}
//             >
//               <div
//                 className="absolute w-16 h-16 rounded-full flex items-center justify-center -top-8 left-6 shadow-md"
//                 style={{ backgroundColor: primaryColor }}
//               >
//                 <svg
//                   className="w-8 h-8 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M7 7h2v10H7zm8 0h2v10h-2z"
//                   />
//                 </svg>
//               </div>

//               <div className="mt-8 flex-1 flex flex-col justify-start">
//                 <StarRating rating={testimonial.rating} />

//                 <p className="text-gray-800 text-lg mb-6 leading-relaxed line-clamp-4">
//                   &quot;{testimonial.quote}&quot;
//                 </p>
//               </div>

//               <div className="mt-4">
//                 <p className="font-semibold text-gray-900 text-lg">
//                   {testimonial.author}
//                 </p>
//                 <p className="text-sm text-gray-600">{testimonial.title}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   );
// }



"use client";

import React from "react";

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  title: string;
  rating: number;
};

type StarProps = {
  rating: number;
};

export default function TestimonialsSection() {
  const primaryColor = "#5a4fcf";

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        "Our attendance management has never been this smooth! The face recognition system is fast, accurate, and secure.",
      author: "Khesav Raj",
      title: "Co-founder of Jhonsans",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "Billzzy Lite has transformed how we handle invoices. Very intuitive and saves us so much time.",
      author: "Jane Doe",
      title: "Small Business Owner",
      rating: 4,
    },
    {
      id: 3,
      quote:
        "The instant bill transfer feature is a game-changer. Everything is digital and super smooth!",
      author: "John Smith",
      title: "Freelance Consultant",
      rating: 5,
    },
    {
      id: 4,
      quote:
        "Using Billzzy cut our transaction time by 50%. The analytics dashboard is extremely useful.",
      author: "Sarah Connor",
      title: "Retail Manager",
      rating: 5,
    },
  ];

  const StarRating = ({ rating }: StarProps) => {
    return (
      <div className="flex justify-start mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-2"
            style={{ color: primaryColor }}
          >
            Testimonials
          </p>

          <h2 className="text-4xl font-extrabold leading-snug text-black">
            <span className="text-black">What Our Happy </span>
            <span className="text-[#5a4fcf] block sm:inline">Users Say</span>
          </h2>
        </div>

        {/* 
          Container Layout:
          Mobile/Tablet: Flex horizontal scroll
          Laptop/Desktop: Grid layout
        */}
        <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:gap-6 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 xl:grid-cols-4 xl:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-none w-11/12 md:w-1/2 snap-center pl-2 pr-2 md:pl-0 md:pr-0 lg:w-auto lg:h-full"
            >
              <div
                className="bg-white p-8 pt-12 rounded-xl shadow-lg border relative flex flex-col justify-between h-full min-h-[320px] transition-transform duration-300 hover:-translate-y-2"
                style={{
                  borderColor: primaryColor,
                  backgroundColor: "rgba(90, 79, 207, 0.03)",
                }}
              >
                {/* Quote Icon */}
                <div
                  className="absolute w-14 h-14 rounded-full flex items-center justify-center -top-7 left-6 shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                  </svg>
                </div>

                <div className="mt-6 flex-1 flex flex-col justify-start">
                  <StarRating rating={testimonial.rating} />
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900 text-lg">
                    {testimonial.author}
                  </p>
                  <p className="text-sm font-medium text-gray-500">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}