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
      <div className="text-center mb-12">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-2"
          style={{ color: primaryColor }}
        >
          Testimonials
        </p>

        <h2 className="text-4xl font-extrabold leading-snug text-black">
          <span className="text-black">What Our Happy </span>
          <span className="text-[#5a4fcf] block">Users Say</span>
        </h2>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar px-4 md:px-8 lg:px-12">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex-none w-11/12 md:w-1/2 lg:w-1/3 p-4 snap-center"
          >
            <div
              className="bg-white p-8 pt-12 rounded-xl shadow-lg border relative flex flex-col justify-between h-[360px]"
              style={{
                borderColor: primaryColor,
                backgroundColor: "rgba(90, 79, 207, 0.05)",
              }}
            >
              <div
                className="absolute w-16 h-16 rounded-full flex items-center justify-center -top-8 left-6 shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h2v10H7zm8 0h2v10h-2z"
                  />
                </svg>
              </div>

              <div className="mt-8 flex-1 flex flex-col justify-start">
                <StarRating rating={testimonial.rating} />

                <p className="text-gray-800 text-lg mb-6 leading-relaxed line-clamp-4">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-900 text-lg">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
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
