// --- Product Endpoints ---
import {GetProductsParams, Product, PaginatedResponse} from "../types";
import { fetchData } from "./fetchData";

export const getProducts = (params: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  return fetchData<PaginatedResponse<Product>>('/products', params as Record<string, string | number | boolean | undefined>);
};

export const getFeaturedProductsList = (limit: number = 10): Promise<Product[]> => 
    getProducts({ isFeatured: true, limit }).then(res => res.items);

export const getNewArrivalProductsList = (limit: number = 10): Promise<Product[]> => 
    getProducts({ isNewArrival: true, sort: 'dateAdded-desc', limit }).then(res => res.items);

export const getShopPreviewProductsList = (limit: number = 10): Promise<Product[]> =>
    getProducts({ limit }).then(res => res.items); 

export const getProductById = (productId: string): Promise<Product> => fetchData<Product>(`/products/${productId}`);

export const getProductsByIds = (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return Promise.resolve([]);
  return getProducts({ ids: ids.join(',') }).then(res => res.items); 
};
export const getSimilarProducts = (productId: string, category?: string, limit: number = 5): Promise<Product[]> => {
  return getProducts({ category, limit: limit + 1 }).then(response =>
    response.items.filter(p => p.id !== productId).slice(0, limit)
  );
};
