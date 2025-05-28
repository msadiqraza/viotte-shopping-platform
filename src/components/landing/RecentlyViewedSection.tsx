// --- src/components/landing/RecentlyViewedSection.tsx ---
import React, { useState, useEffect } from "react"; // Already imported
import { Product } from "../../types";
import { getProductsByIds } from "../../services/productApis"; // addProductToRecentlyViewed is now in services
import { ProductCarousel } from "../shared/ProductCarousel";

const MAX_RECENTLY_VIEWED_DISPLAY_LANDING = 5;
interface RecentlyViewedSectionProps {
  onNavigate: (page: string, params?: any) => void;
}
export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({ onNavigate }) => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let productIds: string[] = [];
    if (typeof window !== "undefined" && window.localStorage) {
      const storedProductIdsJSON = localStorage.getItem("recentlyViewedProductIds");
      if (storedProductIdsJSON) {
        try {
          productIds = JSON.parse(storedProductIdsJSON);
        } catch (e) {
          console.error("Failed to parse recentlyViewedProductIds from localStorage", e);
          localStorage.removeItem("recentlyViewedProductIds");
        }
      }
    }
    if (productIds.length > 0) {
      getProductsByIds(productIds.slice(0, MAX_RECENTLY_VIEWED_DISPLAY_LANDING))
        .then(setRecentlyViewedProducts)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);
  if (isLoading)
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">Recently Viewed</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading recently viewed items...</p>
      </div>
    );
  if (recentlyViewedProducts.length === 0) return null;
  return (
    <ProductCarousel title="Recently Viewed" products={recentlyViewedProducts} itemsToShow={MAX_RECENTLY_VIEWED_DISPLAY_LANDING} onNavigate={onNavigate} />
  );
};
