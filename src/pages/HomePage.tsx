import React, { useState, useEffect } from 'react';
import { Product, BlogPost, CarouselItem as HeroItemType } from '../types'; // Adjust path
import { 
  getCarouselItems, 
  getFeaturedProducts, 
  getNewArrivalProducts, 
  getShopPreviewProducts, 
  getLatestBlogPosts 
} from '../services/api'; // Adjust path

import { HeroCarousel } from '../components/landing/HeroCarousel';
import { ProductCarousel } from '../components/landing/ProductCarousel';
import { BlogPreview } from '../components/landing/BlogPreview';
import { RecentlyViewedSection } from '../components/landing/RecentlyViewedSection';
// Navbar and Footer would typically be in a layout component wrapping this page in App.tsx

export const LandingPage: React.FC = () => {
  const [heroItems, setHeroItems] = useState<HeroItemType[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [shopLoopProducts, setShopLoopProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
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
        setLoadingStates(prev => ({ ...prev, hero: false }));
      } catch (e) { console.error("Hero fetch failed", e); setLoadingStates(prev => ({ ...prev, hero: false }));}
      
      try {
        setFeaturedProducts(await getFeaturedProducts());
        setLoadingStates(prev => ({ ...prev, featured: false }));
      } catch (e) { console.error("Featured fetch failed", e); setLoadingStates(prev => ({ ...prev, featured: false }));}

      try {
        setNewArrivals(await getNewArrivalProducts());
        setLoadingStates(prev => ({ ...prev, newArrivals: false }));
      } catch (e) { console.error("New Arrivals fetch failed", e); setLoadingStates(prev => ({ ...prev, newArrivals: false }));}
      
      try {
        setShopLoopProducts(await getShopPreviewProducts());
        setLoadingStates(prev => ({ ...prev, shopLoop: false }));
      } catch (e) { console.error("Shop Loop fetch failed", e); setLoadingStates(prev => ({ ...prev, shopLoop: false }));}

      try {
        setLatestPosts(await getLatestBlogPosts());
        setLoadingStates(prev => ({ ...prev, blog: false }));
      } catch (e) { console.error("Blog fetch failed", e); setLoadingStates(prev => ({ ...prev, blog: false }));}
    };

    fetchAllData();
  }, []);

  return (
    <div className="bg-stone-50"> {/* Main page background from mockup */}
      {/* Navbar would be here, managed by App.tsx or a Layout component */}
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top section: Hero Carousel + Side Banners */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            {loadingStates.hero ? <div className="h-[300px] md:h-[400px] bg-slate-200 rounded-lg animate-pulse"></div> : <HeroCarousel items={heroItems} />}
          </div>
          <div className="space-y-6">
            <div className="bg-orange-100 p-6 rounded-lg shadow text-center h-[190px] flex flex-col justify-center items-center"> {/* Approx height based on carousel */}
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Check-in to earn credits</h3>
              <p className="text-sm text-orange-600 mb-3">Daily check-ins for exclusive rewards!</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                Check-in Now
              </button>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg shadow text-center h-[190px] flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Join as a Seller</h3>
              <p className="text-sm text-orange-600 mb-3">Reach millions of customers. Start selling today!</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {loadingStates.featured ? <div className="h-72 bg-slate-200 rounded-lg animate-pulse"></div> : <ProductCarousel title="Featured Products" products={featuredProducts} />}
        
        {loadingStates.newArrivals ? <div className="h-72 bg-slate-200 rounded-lg animate-pulse"></div> : <ProductCarousel title="New Arrivals" products={newArrivals} />}
        
        {loadingStates.shopLoop ? <div className="h-72 bg-slate-200 rounded-lg animate-pulse"></div> : <ProductCarousel title="Shop" products={shopLoopProducts} />}
        
        {loadingStates.blog ? <div className="h-80 bg-slate-200 rounded-lg animate-pulse"></div> : <BlogPreview posts={latestPosts} />}
        
        <RecentlyViewedSection />

      </main>

      {/* Footer would be here, managed by App.tsx or a Layout component */}
    </div>
  );
};