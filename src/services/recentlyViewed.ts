const MAX_RECENTLY_VIEWED_STORAGE = 10; 

export const addProductToRecentlyViewed = (productId: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedIdsJSON = localStorage.getItem('recentlyViewedProductIds');
    let ids: string[] = storedIdsJSON ? JSON.parse(storedIdsJSON) : [];
    
    // Remove product if it already exists to move it to the front
    ids = ids.filter(id => id !== productId);
    ids.unshift(productId); // Add to the beginning
    
    // Keep only the last MAX_RECENTLY_VIEWED_STORAGE items
    if (ids.length > MAX_RECENTLY_VIEWED_STORAGE) { 
        ids = ids.slice(0, MAX_RECENTLY_VIEWED_STORAGE);
    }
    
    localStorage.setItem('recentlyViewedProductIds', JSON.stringify(ids));
  }
};

export const getRecentlyViewedProductIds = (): string[] => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedIdsJSON = localStorage.getItem('recentlyViewedProductIds');
    return storedIdsJSON ? JSON.parse(storedIdsJSON) : [];
  }
  return [];
};