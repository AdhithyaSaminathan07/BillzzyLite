'use client';

import { useState, useEffect } from 'react';

export default function UseCasesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const useCases = [
    {
      title: "Mobile Shop",
      image: "/assets/mobile-shop.png",
    },
    {
      title: "Super Market",
      image: "/assets/super-market.png",
    },
    {
      title: "Dress Shop",
      image: "/assets/dress-shop.png",
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === useCases.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [useCases.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? useCases.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === useCases.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#5a4fcf' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#5a4fcf' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4" style={{ fontFamily: 'Poppins' }}>
            <span className="text-black">Perfect for </span><br/>
            <span style={{ color: '#5a4fcf' }}>Small businesses for all kinds</span>
          </h2>
          
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Cards Container with Smooth Transition */}
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {useCases.map((item, index) => (
                <div
                  key={index}
                  className="min-w-full flex justify-center px-4"
                >
                  {/* Card */}
                  <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
                    {/* Image */}
                    <div className="w-full h-64 overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 text-center">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {useCases.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8' 
                  : 'w-3'
              }`}
              style={{ 
                backgroundColor: index === currentIndex ? '#5b3dfc' : '#cbd5e1'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}