// -----------------------------------------------------------------------------
// 8. components/landing/RecentlyViewedSection.tsx
// Description: Section for recently viewed products.
// -----------------------------------------------------------------------------
// Create this file in `src/components/landing/RecentlyViewedSection.tsx`

import React, { useState, useEffect } from 'react';
import { Product } from '../../types'; // Already imported
import { ProductCarousel } from './ProductCarousel'; // Already imported
import { getProductsByIds } from '../../services/api'; // Adjust path

const MAX_RECENTLY_VIEWED = 8; // As per wireframe

export const RecentlyViewedSection: React.FC = () => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, recently viewed IDs would be stored in localStorage
    // For this example, let's mock some IDs.
    // Replace this with actual localStorage logic.
    // const storedProductIdsJSON = localStorage.getItem('recentlyViewedProductIds');
    // let productIds: string[] = [];
    // if (storedProductIdsJSON) {
    //     try {
    //         productIds = JSON.parse(storedProductIdsJSON);
    //     } catch (e) {
    //         console.error("Failed to parse recentlyViewedProductIds from localStorage", e);
    //         localStorage.removeItem('recentlyViewedProductIds'); // Clear corrupted data
    //     }
    // }
    
    // Mock: If you want to test without actual localStorage interaction yet:
    const productIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];


    if (productIds.length > 0) {
      getProductsByIds(productIds.slice(0, MAX_RECENTLY_VIEWED))
        .then(setRecentlyViewedProducts)
        .catch(console.error)
        .finally(() => setIsLoading(true));
    } else {
      setIsLoading(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 px-4 md:px-0">Recently Viewed</h2>
        <p className="px-4 md:px-0 text-slate-500">Loading recently viewed items...</p>
      </div>
    );
  }

  if (recentlyViewedProducts.length === 0) {
    return null; // Or show a placeholder like "You haven't viewed any products yet."
  }

  return (
    <ProductCarousel 
      title="Recently Viewed" 
      products={recentlyViewedProducts} 
      itemsToShow={recentlyViewedProducts.length < 5 ? recentlyViewedProducts.length : 5} // Adjust itemsToShow
    />
  );
};