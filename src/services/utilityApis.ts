import {CarouselItem, Category} from "../types";
import { fetchData, API_BASE_URL } from "./fetchData";

async function mutateData<T, R>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: T): Promise<R> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `API call failed for ${method} ${endpoint}`);
    }
    if (method === 'DELETE' && response.status === 204) { 
        return {} as R; 
    }
    return response.json() as Promise<R>;
  } catch (error) {
    console.error(`Error ${method}ing ${endpoint}:`, error);
    throw error;
  }
}

// --- Utility Endpoints ---
export const getCarouselItems = (): Promise<CarouselItem[]> => fetchData<CarouselItem[]>('/utility/carousel-items');
export const getCategories = (): Promise<Category[]> => fetchData<Category[]>('/utility/categories');
export const subscribeToNewsletter = async (email: string): Promise<{ message: string }> => {
  return mutateData<{email: string}, {message: string}>('/utility/newsletter/subscribe', 'POST', { email });
};