// -----------------------------------------------------------------------------
// 0. types/index.ts
// Description: Defines common TypeScript interfaces for data structures.
// -----------------------------------------------------------------------------
// Create this file in your `src/types/index.ts` directory

export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: number; // e.g., 1-5
    stock: number;
    brand?: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    shippingAddress: Address;
    paymentMethod: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    orderDate: string;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    author: string;
    publishDate: string;
    tags: string[];
  }
  
  export interface JobOpening {
    id: string;
    title: string;
    department: string;
    location: string;
    description: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
  }