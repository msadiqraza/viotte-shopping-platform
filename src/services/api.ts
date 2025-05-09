// -----------------------------------------------------------------------------
// 1. services/api.ts
// Description: Functions to fetch data from the backend.
// -----------------------------------------------------------------------------
// Create this file in `src/services/api.ts`

import { Product, BlogPost, CarouselItem, Category } from '../types'; // Adjust path as needed

const API_BASE_URL = 'http://localhost:3001/api'; // Your backend URL

async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API call failed for ${endpoint}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error; // Re-throw to be caught by the component
  }
}

export const getCarouselItems = (): Promise<CarouselItem[]> => fetchData<CarouselItem[]>('/utility/carousel-items');
export const getFeaturedProducts = (): Promise<Product[]> => fetchData<Product[]>('/products/featured');
export const getNewArrivalProducts = (): Promise<Product[]> => fetchData<Product[]>('/products/new-arrivals');
export const getShopPreviewProducts = (): Promise<Product[]> => fetchData<Product[]>('/products/shop-preview');
export const getLatestBlogPosts = (): Promise<BlogPost[]> => fetchData<BlogPost[]>('/blog/latest');
export const getProductsByIds = (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return Promise.resolve([]);
  return fetchData<Product[]>(`/products/by-ids?ids=${ids.join(',')}`);
};
export const getCategories = (): Promise<Category[]> => fetchData<Category[]>('/utility/categories');

export const subscribeToNewsletter = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/utility/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to subscribe: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};
