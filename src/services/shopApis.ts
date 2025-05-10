// --- Shop Endpoint (for the single main shop) ---
import {Shop} from "../types";

const MAIN_SHOP_SLUG = "yourstore"; 

export const getMainShopDetails = (): Promise<Shop> => {
  console.warn(`Fetching MOCKED main shop data (slug: ${MAIN_SHOP_SLUG})`);
  return new Promise((resolve) => setTimeout(() => {
    const mockMainShop: Shop = {
      id: 'main-store-001', slug: MAIN_SHOP_SLUG, name: 'YourStore Online',
      avatarUrl: 'https://placehold.co/128x128/22c55e/FFFFFF?text=YS', 
      bannerUrl: 'https://placehold.co/1200x300/15803d/FFFFFF?text=Welcome+to+YourStore',
      rating: 4.7, reviewCount: 1234, followersCount: 5678,
      description: "Welcome to YourStore, your premier destination for quality products and an exceptional shopping experience. We are committed to bringing you a diverse selection of items, from the latest trends to timeless classics, all curated with care and attention to detail. Our mission is to make online shopping easy, enjoyable, and reliable. Thank you for choosing YourStore!",
      policies: { 
        shipping: "We offer fast and reliable shipping on all orders. Standard shipping typically takes 3-5 business days. Expedited options are available at checkout. All items are carefully packaged to ensure they arrive in perfect condition.", 
        returns: "Your satisfaction is our priority. If you're not completely happy with your purchase, you can return most items within 30 days for a full refund or exchange. Please see our full return policy page for details and exceptions.", 
        payment: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) as well as PayPal for secure and convenient payment." 
      },
      dateJoined: "2024-01-01T00:00:00Z", location: "Online Based",
      contactInfo: { email: "support@yourstore.site", phone: "1-800-YOUR-STORE", website: "www.yourstore.site" }
    };
    resolve(mockMainShop);
  }, 700));
};

export const followMainStore = async (): Promise<{ success: boolean; followersCount?: number }> => {
  console.log(`UI: Following/Favoriting the main store`);
  return new Promise(resolve => setTimeout(() => {
    resolve({ success: true, followersCount: (Math.floor(Math.random() * 100) + 5678) });
  }, 500));
};
