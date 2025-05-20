// -----------------------------------------------------------------------------
// 12. App.tsx (Simplified to show LandingPage)
// -----------------------------------------------------------------------------
// Modify your `src/App.tsx`

import { Routes, Route, useNavigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage";
import { AccountPage } from "./pages/AccountPage";
import { CartPage } from "./pages/CartPage";
import { ProductListingsPage } from "./pages/ProductListingsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ShopPage } from "./pages/ShopPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BlogPreview } from "./components/landing/BlogPreview";
import { BlogPost } from "./types";
import { AboutUsPage } from "./pages/AboutUsPage";
import { AuthPage } from "./pages/AuthPage";
import { useEffect, useState } from "react";
import { getMainShopDetails } from "./services/shopApis";

function App() {
  const navigate = useNavigate();
const [shopDetails, setShopDetails] = useState(false);
  useEffect(() => {
    if (!shopDetails) {
      getMainShopDetails().then(() => setShopDetails(true));
    }

    setTimeout(() => {
      setShopDetails(false);
    }, 10000);
  }, [shopDetails]);
  
  const onNavigate = (path: string) => {
    navigate(path);
  };

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Blog Post 1",
      slug: "blog-post-1",
      excerpt: "Excerpt for blog post 1",
      content: "Content for blog post 1",
      imageUrl: "https://via.placeholder.com/150",
      author: "John Doe",
      publishDate: "2023-01-01",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "2",
      title: "Blog Post 2",
      slug: "blog-post-2",
      excerpt: "Excerpt for blog post 2",
      content: "Content for blog post 2",
      imageUrl: "https://via.placeholder.com/150",
      author: "Jane Smith",
      publishDate: "2023-01-02",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "3",
      title: "Blog Post 3",
      slug: "blog-post-3",
      excerpt: "Excerpt for blog post 3",
      content: "Content for blog post 3",
      imageUrl: "https://via.placeholder.com/150",
      author: "John Doe",
      publishDate: "2023-01-03",
      tags: ["tag1", "tag2", "tag3"],
    },
  ];

  return (
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar onNavigate={onNavigate}/>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage onNavigate={onNavigate} />} />
            
            {/* Navbar */}
            <Route path="/account" element={<AccountPage onNavigate={onNavigate} />} />
            <Route path="/login" element={<AuthPage onNavigate={onNavigate} initialMode="login" />} />
            <Route path="/cart" element={<CartPage onNavigate={onNavigate} />} />
            
            <Route path="/products" element={<ProductListingsPage onNavigate={onNavigate} />} />
            <Route path="/product/:id" element={<ProductDetailPage onNavigate={onNavigate} />} />
            
            <Route path="/shop" element={<ShopPage onNavigate={onNavigate} />} />
            <Route path="/shop/about" element={<ShopPage onNavigate={onNavigate} />} />
            <Route path="/shop/policies" element={<ShopPage onNavigate={onNavigate} />} />
            
            <Route path="/about" element={<AboutUsPage onNavigate={onNavigate} />} />
            {/* Checkout */}
            <Route path="/blog" element={<BlogPreview posts={blogPosts} onNavigate={onNavigate} />} />
            <Route path="/checkout" element={<CheckoutPage onNavigate={onNavigate} />} />
          </Routes>
        </div>
        <Footer />
      </div>
  );
}

export default App;
