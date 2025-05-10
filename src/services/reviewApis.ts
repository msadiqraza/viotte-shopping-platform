// --- Review Endpoints ---
import { Review } from "../types";

export const getProductReviews = (productId: string): Promise<Review[]> => {
  console.warn(`Fetching MOCKED reviews for product ${productId}`);
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 'r1', productId, reviewerName: 'Alice M.', rating: 5, date: '2025-05-01T10:00:00Z', comment: 'Absolutely love this product!', verifiedPurchase: true, reviewerAvatar: 'https://placehold.co/40x40/FFC0CB/000000?text=A' },
    { id: 'r2', productId, reviewerName: 'Bob K.', rating: 4, date: '2025-04-28T14:30:00Z', comment: 'Great value for the price.', verifiedPurchase: true, reviewerAvatar: 'https://placehold.co/40x40/ADD8E6/000000?text=B' },
  ]), 500));
};