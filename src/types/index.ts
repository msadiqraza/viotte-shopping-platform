// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts if any
  imageUrl: string; // Main image URL
  images?: string[]; // Array of image URLs for gallery
  category: string; // Should ideally be a slug or ID
  rating: number;
  reviewCount?: number; // Number of reviews
  stock: number;
  brand?: string;
  seller?: {
    // Will refer to the main shop
    id: string; // Main shop's ID (e.g., "main-store-id")
    name: string; // Main shop's name (e.g., "viotte")
  };
  sizes?: string[]; // Available sizes
  colors?: { name: string; hex: string }[]; // Available colors
  isFeatured?: boolean;
  isNewArrival?: boolean;
  dateAdded?: string; // ISO date string
  tags?: string[];
  policies?: {
    // Product-specific policies, or could be inherited from shop
    shipping?: string;
    returns?: string;
    payment?: string;
  };
}

export interface Shop {
  // Represents the single main store
  id: string; // e.g., "main-store-id"
  name: string; // e.g., "viotte"
  slug: string; // e.g., "main-store" (for the URL, if desired)
  avatarUrl: string;
  bannerUrl: string;
  rating: number; // Overall store rating (if applicable)
  reviewCount: number; // Overall store review count (if applicable)
  followersCount?: number; // If a "Follow Us" feature is kept
  description: string; // For the "About Us" tab of the store
  policies_shipping: string;
  policies_returns: string;
  policies_payment: string;
  dateJoined: string; // ISO date string (when the platform was "founded")
  location?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface CarouselItem {
  id: string;
  imageUrl: string;
  altText: string;
  link?: string;
  title?: string;
  subtitle?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
  imageUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1-5
  date: string; // ISO date string
  comment: string;
  verifiedPurchase?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishDate: string; // ISO date string
  tags: string[];
}

// --- ACCOUNT PAGE TYPES ---
export interface UserAccountDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  avatar_url?: string;
}

export type CollectionItem = Product;

// --- CART & ORDER TYPES ---
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: {
    code?: string;
    amount: number;
  };
  shippingCost?: number;
  taxes?: number;
  total: number;
  lastUpdated: string;
}

export interface OrderItem extends Product {
  quantity: number;
  priceAtPurchase: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  datePlaced: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Returned"
    | "PaymentFailed";
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  shippingCost: number;
  taxes: number;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentDetails?: {
    transactionId?: string;
    cardLast4?: string;
    paymentStatus: "Paid" | "Pending" | "Failed";
  };
  trackingNumber?: string;
  trackingUrl?: string;
  customerNotes?: string;
}

export interface Address {
  id?: string;
  type?: "Shipping" | "Billing";
  isDefault?: boolean;
  fullName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: "CreditCard" | "PayPal" | "Other";
  isDefault?: boolean;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardBrand?: "Visa" | "Mastercard" | "Amex" | "Discover" | "Other";
  email?: string;
  nameOnCard?: string;
}

export interface GetProductsParams {
  category?: string;
  shopId?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  ids?: string | undefined; // Change to string | undefined from string | string[]
}

export interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemoveItem: (productId: string, size?: string, color?: string) => void;
  isUpdating?: boolean;
}

export interface PersonalInfoSectionProps {
  userDetails: UserAccountDetails | null;
  onUpdateDetails: (
    details: Partial<UserAccountDetails>
  ) => Promise<{ success: boolean; updatedDetails?: UserAccountDetails }>;
  isLoading: boolean;
}

export interface CollectionSectionProps {
  onNavigate: (page: string, params?: any) => void;
}

export type AccountTabId =
  | "personal-info"
  | "collection"
  | "orders"
  | "addresses"
  | "payment-methods";

export interface AccountPageProps {
  initialTab?: AccountTabId;
  onNavigate: (page: string, params?: any) => void;
}

export interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
}
