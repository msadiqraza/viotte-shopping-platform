// -----------------------------------------------------------------------------
// 13. App.tsx (Main application component to demonstrate navigation)
// -----------------------------------------------------------------------------
// Create this file in your `src/App.tsx` directory

import React, { useState, useEffect } from 'react';
// Import page components (adjust paths if your structure is different)
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { ProductListingsPage } from './pages/ProductListingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { BlogPage } from './pages/BlogPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { JoinAsSellerPage } from './pages/JoinAsSellerPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CareerPage } from './pages/CareerPage';

// A simple Home Page component for demonstration
const HomePage: React.FC<{setCurrentPage: (page: string) => void}> = ({setCurrentPage}) => (
  <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center p-8">
    <img src="https://placehold.co/300x200/0ea5e9/ffffff?text=Welcome+to+YourStore" alt="Welcome Banner" className="mb-8 rounded-lg shadow-xl" onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x200/cccccc/ffffff?text=Welcome')} />
    <h1 className="text-5xl font-extrabold text-slate-800 mb-6">Welcome to YourStore!</h1>
    <p className="text-xl text-slate-600 mb-10 max-w-2xl">
      Discover amazing products, seamless shopping, and a world of possibilities. We're thrilled to have you here.
    </p>
    <div className="space-x-4">
      <button 
        onClick={() => setCurrentPage('products')}
        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform duration-150 ease-in-out transform hover:scale-105"
      >
        Shop Now
      </button>
      <button 
        onClick={() => setCurrentPage('about')}
        className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform duration-150 ease-in-out transform hover:scale-105"
      >
        Learn More About Us
      </button>
    </div>
     <div className="mt-16 p-6 bg-white rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Electronics', 'Apparel', 'Home Goods', 'Books'].map(cat => (
                <div key={cat} className="p-4 bg-slate-50 rounded-md hover:bg-sky-100 cursor-pointer transition-colors" onClick={() => setCurrentPage('products')}>
                    <p className="font-medium text-sky-700">{cat}</p>
                </div>
            ))}
        </div>
    </div>
  </div>
);


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home'); // Default to home
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Simple auth state

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'auth':
        return <AuthPage />;
      case 'products':
        return <ProductListingsPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutUsPage />;
      case 'policies':
        return <PoliciesPage />;
      case 'blog':
        return <BlogPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'join-seller':
        return <JoinAsSellerPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'career':
        return <CareerPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage}/>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">YourStore</h5>
              <p className="text-sm mb-4">Your one-stop shop for everything you need. Quality products, unbeatable prices.</p>
              <div className="flex space-x-4">
                {/* Placeholder social icons */}
                <a href="#" className="hover:text-sky-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
                <a href="#" className="hover:text-sky-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
                <a href="#" className="hover:text-sky-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12.001c0 4.843 3.602 8.863 8.204 9.724.06.452.092.91.092 1.372 0 1.514-.426 2.898-1.166 4.037a.75.75 0 001.298.748c.868-1.018 1.32-2.266 1.32-3.585 0-.462-.032-.91-.093-1.362 4.602-.861 8.204-4.881 8.204-9.724C22 6.477 17.523 2 12 2zm0 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-8.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg></a>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('about')}} className="hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('products')}} className="hover:text-sky-400 transition-colors">Products</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('blog')}} className="hover:text-sky-400 transition-colors">Blog</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('career')}} className="hover:text-sky-400 transition-colors">Careers</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('join-seller')}} className="hover:text-sky-400 transition-colors">Sell on YourStore</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">FAQ</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('policies')}} className="hover:text-sky-400 transition-colors">Shipping & Returns</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('terms')}} className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('privacy')}} className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white mb-4">Newsletter</h5>
              <p className="text-sm mb-3">Subscribe to get notified about product launches, special offers and news.</p>
              <form className="flex">
                <input type="email" placeholder="Enter your email" className="w-full rounded-l-md py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-r-md text-sm font-medium transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} YourStore. All rights reserved. Built with React, TypeScript & Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;