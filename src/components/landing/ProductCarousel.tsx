// -----------------------------------------------------------------------------
// 5. components/landing/ProductCarousel.tsx
// Description: Reusable carousel for product listings.
// -----------------------------------------------------------------------------
// Create this file in `src/components/landing/ProductCarousel.tsx`

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../../types'; // Already imported if in same file
import { ProductCard } from '../shared/ProductCard'; // Already imported if in same file
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Already imported

interface ProductCarouselProps {
  title: string;
  products: Product[];
  itemsToShow?: number; // Number of items visible at once
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, itemsToShow = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const totalItems = products.length;
  const itemWidthPercentage = 100 / itemsToShow;

  const autoRotate = useCallback(() => {
    setCurrentIndex(prev => (prev >= totalItems - itemsToShow ? 0 : prev + 1));
  }, [totalItems, itemsToShow]);

  useEffect(() => {
    if (products.length <= itemsToShow) return; // No rotation if not enough items to scroll
    const timer = setInterval(autoRotate, 7000); // Rotate every 7 seconds
    return () => clearInterval(timer);
  }, [products.length, itemsToShow, autoRotate]);

  const scroll = (direction: 'left' | 'right') => {
    let newIndex;
    if (direction === 'right') {
      newIndex = currentIndex + 1;
      if (newIndex > totalItems - itemsToShow) {
        newIndex = 0; // Loop to start
      }
    } else {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = Math.max(0, totalItems - itemsToShow); // Loop to end
      }
    }
    setCurrentIndex(newIndex);
  };
  
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;
    }
  }, [currentIndex, itemWidthPercentage]);


  if (!products || products.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">{title}</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4 px-4 md:px-0">
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        {products.length > itemsToShow && (
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors disabled:opacity-50"
              aria-label={`Scroll ${title} left`}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors disabled:opacity-50"
              aria-label={`Scroll ${title} right`}
              disabled={currentIndex >= totalItems - itemsToShow}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden relative px-2 md:px-0"> {/* Added padding for edge cards */}
        <div 
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ width: `${(totalItems / itemsToShow) * 100}%` }} // Adjust total width for items
        >
          {products.map((product) => (
            <div 
                key={product.id} 
                className="px-2 flex-shrink-0" // Added px-2 for spacing between cards
                style={{ width: `${itemWidthPercentage}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};