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

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name?: string;
  street_address1: string;
  street_address2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number?: string;
  is_default: boolean;
  type: "Shipping" | "Billing" | "Both";
  created_at?: string;
  updated_at?: string;
}

export type AddressFormData = Omit<Address, "id" | "user_id" | "isDefault" | "created_at" | "updated_at">;

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
  onNavigate: (page: string, params?: NavigateParams) => void;
  onAddToCart: (prodId: string, quantity: number, price: number, name?: string, imageUrl?: string, size?: string, color?: string) => void;
}

export interface LandingPageProps {
  onNavigate: (page: string, params?: NavigateParams) => void;
  posts: BlogPost[];
  onAddToCart: (
    prodId: string,
    quantity: number,
    price: number,
    name?: string,
    imageUrl?: string,
    size?: string,
    color?: string
  ) => void;
}

export type AccountTabId =
  | "personal-info"
  | "collection"
  | "orders"
  | "addresses"
  | "payment-methods";

export interface AccountPageProps {
  initialTab?: AccountTabId;
  onNavigate: (page: string, params?: NavigateParams) => void;
  onAddToCart: (prodId: string, quantity: number, price: number, name?: string, imageUrl?: string, size?: string, color?: string) => void;
}

export interface NavbarProps {
  onNavigate: (page: string, params?: NavigateParams) => void;
}

export interface NavigateParams {
  returnUrl?: string;
  categorySlug?: string;
  slug?: string;
  initialSearchTerm?: string;
  id?: string;
  productId?: string;
  quantity?: number;
  priceAtPurchase?: number;
  selectedSize?: string;
  selectedColor?: string;
  orderNumber?: string;
  orderId?: string;
  replace?: boolean;
}

// Payment Types
export interface PaymentMethod {
  id: string; // Your internal ID for the saved payment method (from your DB)
  user_id: string;
  type: "stripe" | "paypal" | "card";
  provider_payment_method_id: string; // e.g., Stripe PaymentMethod ID (pm_xxx)
  brand?: string;
  last4?: string;
  is_default: boolean;
  email?: string; // For PayPal
  created_at: string;
}

export interface NewPaymentMethodData {
  type: "stripe" | "card";
  stripePaymentMethodId: string; // Stripe's pm_xxx ID
  isDefault?: boolean; // Optional: whether to set this new card as default
  cardDetails?: {
    // Optional: client might have some non-sensitive details
    brand?: string;
    last4?: string;
  };
}

export interface StripeIntentResponse {
  // Renamed for clarity, can be Setup or Payment Intent
  clientSecret: string;
  customerId?: string; // Stripe Customer ID, useful for some Stripe Elements configurations
  paymentIntentId?: string; // For PaymentIntents
  error?: string; // If backend returns an error object
}