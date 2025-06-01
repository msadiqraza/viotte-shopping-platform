// src/pages/LandingPage.tsx
import React, { useState, useEffect } from "react";
import { Product, CarouselItem as HeroItemType, LandingPageProps } from "../types";
import { getCarouselItems } from "../services/utilityApis";
import { getFeaturedProductsList } from "../services/productApis";
import { getNewArrivalProductsList } from "../services/productApis";
import { getShopPreviewProductsList } from "../services/productApis";
// import { getLatestBlogPosts } from "../services/blogPostApis";
import { HeroCarousel } from "../components/landing/HeroCarousel";
import { ProductCarousel } from "../components/shared/ProductCarousel";
import { BlogPreview } from "../components/landing/BlogPreview";
import { RecentlyViewedSection } from "../components/landing/RecentlyViewedSection";
// import { BlogPost } from "../types";

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onAddToCart, posts }) => {
  const [heroItems, setHeroItems] = useState<HeroItemType[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [shopLoopProducts, setShopLoopProducts] = useState<Product[]>([]);
  // const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    hero: true,
    featured: true,
    newArrivals: true,
    shopLoop: true,
    blog: true,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setHeroItems(await getCarouselItems());
      } catch (e) {
        console.error("Hero fetch failed", e);
      } finally {
        setLoadingStates((prev) => ({ ...prev, hero: false }));
      }
      try {
        setFeaturedProducts(await getFeaturedProductsList());
      } catch (e) {
        console.error("Featured fetch failed", e);
      } finally {
        setLoadingStates((prev) => ({ ...prev, featured: false }));
      }
      try {
        setNewArrivals(await getNewArrivalProductsList());
      } catch (e) {
        console.error("New Arrivals fetch failed", e);
      } finally {
        setLoadingStates((prev) => ({ ...prev, newArrivals: false }));
      }
      try {
        setShopLoopProducts(
          await getShopPreviewProductsList("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        );
      } catch (e) {
        console.error("Shop Loop fetch failed", e);
      } finally {
        setLoadingStates((prev) => ({ ...prev, shopLoop: false }));
      }
      // try {
      //   setLatestPosts(await getLatestBlogPosts());
      // } catch (e) {
      //   console.error("Blog fetch failed", e);
      // } finally {
      //   setLoadingStates((prev) => ({ ...prev, blog: false }));
      // }
    };
    fetchAllData();
  }, []);

  return (
    <div className="bg-stone-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            {loadingStates.hero ? (
              <div className="h-[300px] md:h-[400px] bg-slate-200 rounded-lg animate-pulse"></div>
            ) : (
              <HeroCarousel items={heroItems} />
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-orange-100 p-6 rounded-lg shadow text-center h-[190px] flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">
                Check-in to earn credits
              </h3>
              <p className="text-sm text-orange-600 mb-3">Daily check-ins for exclusive rewards!</p>
              <button
                onClick={() => onNavigate("credits")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                Check-in Now
              </button>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg shadow text-center h-[190px] flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Partner with Us</h3>
              <p className="text-sm text-orange-600 mb-3">
                Opportunities for partners and affiliates.
              </p>
              <button
                onClick={() => onNavigate("join-seller")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
        {loadingStates.featured ? (
          <div className="h-80 bg-slate-200 rounded-lg animate-pulse"></div>
        ) : (
          <ProductCarousel
            title="Featured Products"
            products={featuredProducts}
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
          />
        )}
        {loadingStates.newArrivals ? (
          <div className="h-80 bg-slate-200 rounded-lg animate-pulse"></div>
        ) : (
          <ProductCarousel
            title="New Arrivals"
            products={newArrivals}
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
          />
        )}
        {loadingStates.shopLoop ? (
          <div className="h-80 bg-slate-200 rounded-lg animate-pulse"></div>
        ) : (
          <ProductCarousel
            title="Shop Our Collection"
            products={shopLoopProducts}
            onAddToCart={onAddToCart}
            onNavigate={onNavigate}
          />
        )}
        <BlogPreview posts={posts} onNavigate={onNavigate} />
        <RecentlyViewedSection onNavigate={onNavigate} onAddToCart={onAddToCart} />
      </main>
    </div>
  );
};
