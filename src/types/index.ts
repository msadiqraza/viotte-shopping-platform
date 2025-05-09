// -----------------------------------------------------------------------------
// 0. types/index.ts
// Description: Defines common TypeScript interfaces for data structures.
// -----------------------------------------------------------------------------
// Create this file in your `src/types/index.ts` directory

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  stock: number;
  brand?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  dateAdded?: string;
  tags?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Full content for blog detail page
  imageUrl: string;
  author: string;
  publishDate: string;
  tags: string[];
}

export interface CarouselItem {
  id: string;
  imageUrl: string;
  altText: string;
  link?: string; // Optional link for the carousel slide
  title?: string; // Optional title/caption
  subtitle?: string; // Optional subtitle/caption
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}