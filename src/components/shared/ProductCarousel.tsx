// --- src/components/shared/ProductCarousel.tsx ---
// (Moved from landing to shared as it's used by landing, recently viewed, shop products, similar products etc.)
import React, { useState, useEffect, useRef, useCallback } from "react"; // Already imported
import { Product as ProductTypeCarousel } from "../../types"; // Aliased to avoid conflict
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Already imported
import { NavigateParams } from "../../types";

interface ProductCarouselProps {
  title: string;
  products: ProductTypeCarousel[];
  itemsToShow?: number;
  onNavigate: (page: string, params?: NavigateParams) => void;
}
export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, itemsToShow = 5, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const totalItems = products.length;

  const getItemsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 768) return 3;
      if (window.innerWidth < 1024) return 4;
    }
    return itemsToShow;
  };
  const [currentItemsToShow, setCurrentItemsToShow] = useState(getItemsToShow());

  useEffect(() => {
    const handleResize = () => setCurrentItemsToShow(getItemsToShow());
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [itemsToShow]);

  const itemWidthPercentage = 100 / currentItemsToShow;
  const autoRotate = useCallback(() => {
    if (totalItems <= currentItemsToShow) return;
    setCurrentIndex((prev) => (prev >= totalItems - currentItemsToShow ? 0 : prev + 1));
  }, [totalItems, currentItemsToShow]);

  useEffect(() => {
    if (totalItems <= currentItemsToShow) return;
    const timer = setInterval(autoRotate, 7000);
    return () => clearInterval(timer);
  }, [totalItems, currentItemsToShow, autoRotate]);

  const scroll = (direction: "left" | "right") => {
    let newIndex;
    if (direction === "right") {
      newIndex = currentIndex + 1;
      if (newIndex > totalItems - currentItemsToShow) newIndex = 0;
    } else {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = Math.max(0, totalItems - currentItemsToShow);
    }
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;
  }, [currentIndex, itemWidthPercentage]);

  if (!products || products.length === 0)
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">{title}</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading products...</p>
      </div>
    );

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4 px-4 md:px-0">
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        {totalItems > currentItemsToShow && (
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors disabled:opacity-50"
              aria-label={`Scroll ${title} left`}
              disabled={currentIndex === 0 && totalItems <= currentItemsToShow}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors disabled:opacity-50"
              aria-label={`Scroll ${title} right`}
              disabled={currentIndex >= totalItems - currentItemsToShow && totalItems <= currentItemsToShow}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden relative px-1 md:px-0">
        <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out" style={{ width: `${(totalItems / currentItemsToShow) * 100}%` }}>
          {products.map((product) => (
            <div key={product.id} className="px-1.5 sm:px-2 flex-shrink-0 min-w-[300px]" style={{ width: `${itemWidthPercentage}%` }}>
              <ProductCard product={product} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
