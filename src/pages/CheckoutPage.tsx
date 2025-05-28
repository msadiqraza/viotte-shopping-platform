// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react"; // Already imported
import { Truck, CreditCard, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { CheckoutStepIndicator } from "../components/checkout/CheckoutStepIndicator";
import { useAuth } from "../contexts/AuthContext";
import { useLoginPrompt } from "../contexts/LoginPromptContext";
import { useNavigate } from "react-router-dom";

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}
export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const checkoutSteps = [
    { title: "Shipping", icon: Truck },
    { title: "Payment", icon: CreditCard },
    { title: "Review", icon: ShoppingBagIcon },
  ];
  const auth = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading) {
      return; // Wait for auth state
    }
    if (!auth.user) {
      showLoginPrompt({ returnUrl: "/checkout" });
    }
  }, [auth.user, auth.loading, showLoginPrompt]);

  // Use onNavigateProp for external navigation passed from App.tsx,
  // and internal navigate for redirects within checkout flow or to login.
  const customOnNavigate =
    onNavigate ||
    ((path: string, params?: any) =>
      navigate(params ? `${path}?${new URLSearchParams(params)}` : path));

  if (auth.loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50">
        <p>Loading...</p>
      </div> 
    );
  }

  if (!auth.user) {
    // The modal will be visible, or you can show a placeholder.
    // Or, if the modal navigates to /login, this page might not render until user is back.
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-700 mb-3">Ready to Checkout?</h1>
        <p className="text-slate-500 mb-6">Please log in or sign up to complete your order.</p>
        {/* The prompt is already shown by useEffect, this is a fallback message area */}
      </div>
    );
  }
  return (
    <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Checkout</h1>
        <CheckoutStepIndicator currentStep={currentStep} steps={checkoutSteps} />

        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Shipping Information</h2>
            <p>Shipping address form and selection will go here.</p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => customOnNavigate("cart")}
                className="text-sm text-slate-600 hover:text-green-700 font-medium"
              >
                Back to Cart
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Payment Details</h2>
            <p>Payment method form and selection will go here.</p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-sm text-slate-600 hover:text-green-700 font-medium"
              >
                Back to Shipping
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                Next: Review Order
              </button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Review Your Order</h2>
            <p>Order summary, items, shipping, payment details for final review.</p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-slate-600 hover:text-green-700 font-medium"
              >
                Back to Payment
              </button>
              <button
                onClick={() => {
                  alert("Order Placed (Mock)!");
                  customOnNavigate("order-confirmation", { orderId: "mockOrder123" });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
