// -----------------------------------------------------------------------------
// 4. components/landing/HeroCarousel.tsx
// Description: Main image carousel for the landing page.
// -----------------------------------------------------------------------------
// Create this file in `src/components/landing/HeroCarousel.tsx`

import React, { useState, useEffect, useCallback } from 'react';
import { CarouselItem } from '../../types'; // Adjust path
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  items: CarouselItem[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000); // Rotate every 7 seconds as per wireframe
    return () => clearInterval(timer);
  }, [items.length, nextSlide]);

  if (!items || items.length === 0) {
    return <div className="w-full h-[300px] md:h-[400px] bg-slate-200 flex items-center justify-center text-slate-500 rounded">Loading Carousel...</div>;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={item.imageUrl} 
            alt={item.altText} 
            className="w-full h-full object-cover" 
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/1200x400/e0e0e0/757575?text=Banner+Error')}
          />
          {/* Optional: Add overlay with title/subtitle if present in CarouselItem type and data */}
          {(item.title || item.subtitle) && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center p-4">
              {item.title && <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">{item.title}</h2>}
              {item.subtitle && <p className="text-white text-md md:text-lg">{item.subtitle}</p>}
              {item.link && <a href={item.link} className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold transition-colors">Shop Now</a>}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-opacity focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-opacity focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};