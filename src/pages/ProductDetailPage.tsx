// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Product as ProductDetailType, Review as ReviewType } from "../types";
import { getProductById } from "../services/productApis";
import { getProductReviews } from "../services/reviewApis";
import { getSimilarProducts } from "../services/productApis";
import { addProductToRecentlyViewed } from "../services/recentlyViewed"; // Assuming it's exported from there
import { ProductImageGallery } from "../components/product/ProductImageGallery";
import { ProductInfo } from "../components/product/ProductInfo";
import { SellerPolicies } from "../components/product/SellerPolicies";
import { CustomerReviews } from "../components/product/CustomerReviews";
import { ProductCarousel as SimilarProductCarousel } from "../components/shared/ProductCarousel"; // Updated path
import { CollectionSectionProps as ProductDetailPageProps } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useLoginPrompt } from "../contexts/LoginPromptContext";
import {
  addToCollection as addToWishlistService,
  // removeFromCollection as removeFromWishlistService,
} from "../services/accountApis";

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onNavigate, onAddToCart }) => {
  let { id } = useParams();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [similarProducts, setSimilarProducts] = useState<ProductDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  id = id || "";

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        if (productData) {
          // Ensure productData is not null before using its properties
          addProductToRecentlyViewed(id); // Add to recently viewed
          const [reviewsData, similarData] = await Promise.all([
            getProductReviews(id),
            getSimilarProducts(id, productData.category),
          ]);
          setReviews(reviewsData);
          setSimilarProducts(similarData);
        } else {
          setError("Product data could not be fetched.");
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setError(err.message || "Could not load product information.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProductData();
    else {
      setError("No product ID provided.");
      setIsLoading(false);
    }
  }, [id]);

  // const handleBuyNow = (prodId: string, quantity: number) => {
  //   // TODO: Implement buy now functionality 
  //   if (!auth.user) {
  //     showLoginPrompt({ returnUrl: `/product/${prodId}` }); // Could pass query params for checkout intent
  //     return;
  //   }
  //   // Add to cart first, then navigate to checkout
  //   // This logic might need to be more robust (e.g. ensure item is in cart before navigating)
  //   console.log(`Buy now: ${prodId}, Qty: ${quantity}`); //
  //   // await handleAddToCart(prodId, quantity, product.price, product.name, product.imageUrl, selectedSize, selectedColor); // Example
  //   onNavigate("checkout", { productId: prodId, quantity }); //
  // };

const handleWishlist = async (prodId: string): Promise<boolean> => {
  if (!auth.user) {
    showLoginPrompt({ returnUrl: `/product/${prodId}` });
    return false;
  }
  try {
    await addToWishlistService(prodId);
    return true;
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    alert("Could not add item to wishlist. Please try again.");
    return false;
  }
};

console.log("product", product);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-3 text-slate-700">Loading Product...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Product</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => onNavigate("landing")}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Go to Homepage
        </button>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-slate-700 text-xl">Product not found.</p>
      </div>
    );

  return (
    <div className="bg-stone-50 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductImageGallery
            mainImageUrl={product.imageUrl}
            thumbnailUrls={product.images}
            productName={product.name}
          />
          <div>
            <ProductInfo
              product={product}
              onAddToCart={onAddToCart}
              // onBuyNow={handleBuyNow}
              onWishlist={handleWishlist}
              onNavigate={onNavigate}
            />
          </div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {product.policies && <SellerPolicies policies={product.policies} />}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Product Description</h2>
              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: product.description || "<p>No description available.</p>",
                }}
              ></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <CustomerReviews
              reviews={reviews}
              averageRating={product.rating}
              totalReviews={product.reviewCount || reviews.length}
            />
          </div>
        </section>
        {similarProducts.length > 0 && (
          <section className="mb-12">
            <SimilarProductCarousel
              title="Similar Products"
              products={similarProducts}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
            />
          </section>
        )}
      </main>
    </div>
  );
};
