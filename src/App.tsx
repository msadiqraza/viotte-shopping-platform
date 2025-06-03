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
import { CreditsPage } from "./pages/CreditsPage";
import { JoinSellerPage } from "./pages/JoinSellerPage";
import { AdminPage } from "./pages/AdminPage";

// Contexts
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Assuming path
import { LoginPromptProvider, useLoginPrompt } from "./contexts/LoginPromptContext"; // Assuming path
import { useLocation } from "react-router-dom";
import { NavigateParams } from "./types";
import { addSupabaseItemToCart } from "./services/cartCheckoutApis";

// Helper component to render the login modal
const LoginPromptModal = () => {
  const { isLoginPromptVisible, hideLoginPrompt } = useLoginPrompt();
  // const auth = useAuth(); // Get auth context to check user status
  const navigate = useNavigate();
  const location = useLocation();

  // Extract returnUrl from location state if AuthPage was navigated to directly for the prompt
  const returnUrlFromState = (location.state as { returnUrl?: string })?.returnUrl;

  if (!isLoginPromptVisible && !returnUrlFromState) {
    return null;
  }

  const handleLoginSuccess = () => {
    hideLoginPrompt();
    const redirectPath = returnUrlFromState || "/account"; // Use state or default
    navigate(redirectPath, { replace: true, state: {} }); // Clear state after redirect
  };

  // If using a modal overlay for AuthPage
  if (isLoginPromptVisible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl h-full w-full">
          <AuthPage onLoginSuccess={handleLoginSuccess} onNavigate={(page) => navigate(page)} />
        </div>
      </div>
    );
  }
  return null;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  const handleNavigate = (path: string, params?: NavigateParams) => {
    if (params?.returnUrl) {
      navigate(path, { state: { returnUrl: params.returnUrl } });
    } else if (params) {
      console.log("Navigating to ", path, " with params ", params);
      navigate(path, { state: { ...params } });
    } else {
      navigate(path);
    }
  };

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Blog Post 1",
      slug: "blog-post-1",
      excerpt: "Excerpt for blog post 1",
      content: "Content for blog post 1",
      imageUrl: "https://placehold.co/150x150?text=Viotte",
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
      imageUrl: "https://placehold.co/150x150?text=Viotte",
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
      imageUrl: "https://placehold.co/150x150?text=Viotte",
      author: "John Doe",
      publishDate: "2023-01-03",
      tags: ["tag1", "tag2", "tag3"],
    },
  ];

  const handleAddToCart = async (
    prodId: string,
    quantity: number,
    price: number,
    name?: string,
    imageUrl?: string,
    size?: string,
    color?: string
  ) => {
    if (!auth.user) {
      showLoginPrompt({ returnUrl: `/product/${prodId}` });
      return false;
    }
    try {
      // Assuming addSupabaseItemToCart exists and is properly defined
      await addSupabaseItemToCart({
        productId: prodId,
        quantity,
        price,
        name,
        imageUrl,
        size,
        color,
      });
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add item to cart. Please try again.");
      return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar onNavigate={handleNavigate} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} posts={blogPosts}/>} />
          <Route path="/account" element={<AccountPage onNavigate={handleNavigate} onAddToCart={handleAddToCart}/>} />

          <Route
            path="/login"
            element={
              <AuthPage
                onNavigate={handleNavigate}
                initialMode="login"
                onLoginSuccess={() => {
                  const returnUrl =
                    (location.state as { returnUrl?: string })?.returnUrl || "/account";
                  navigate(returnUrl, { replace: true, state: {} });
                }}
              />
            }
          />
          <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />

          <Route path="/products" element={<ProductListingsPage onNavigate={handleNavigate} onAddToCart={handleAddToCart}/>} />
          <Route path="/product/:id" element={<ProductDetailPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} />

          <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} onAddToCart={handleAddToCart}/>} />
          {/* <Route path="/shop/about" element={<ShopPage onNavigate={handleNavigate} />} />
          <Route path="/shop/policies" element={<ShopPage onNavigate={handleNavigate} />} /> */}

          <Route path="/about" element={<AboutUsPage onNavigate={handleNavigate} />} />

          <Route
            path="/blog"
            element={<BlogPreview posts={blogPosts} onNavigate={handleNavigate} />}
          />
          <Route path="/checkout" element={<CheckoutPage onNavigate={handleNavigate} />} />

          <Route path="/credits" element={<CreditsPage onNavigate={handleNavigate} />} />
          <Route path="/join-seller" element={<JoinSellerPage onNavigate={handleNavigate} />} />
          <Route path="/admin" element={<AdminPage onNavigate={handleNavigate} />} />
        </Routes>
      </div>
      <Footer onNavigate={handleNavigate} />
      <LoginPromptModal />
    </div>
  );
}

function App() {
  return (
    // BrowserRouter should be at the very top, typically in index.tsx or main.tsx
    // Assuming BrowserRouter is wrapping this App component higher up.
    <AuthProvider>
      <LoginPromptProvider>
        <AppContent />
      </LoginPromptProvider>
    </AuthProvider>
  );
}

export default App;
