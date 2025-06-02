// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { Truck, CreditCard, ShoppingBag as ShoppingBagIcon, AlertTriangle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

import { CheckoutStepIndicator } from "../components/checkout/CheckoutStepIndicator"; // Adjust path
import { PaymentStepManager } from "../components/checkout/PaymentStepManager"; // Adjust path (NEW)
import { useAuth } from "../contexts/AuthContext"; // Adjust path
import { useLoginPrompt } from "../contexts/LoginPromptContext"; // Adjust path
import { useNavigate } from "react-router-dom";
import { NavigateParams } from "../types"; // Adjust path

// Ensure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY" // Fallback for safety
);
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    "Stripe Publishable Key is not set in .env. Using a placeholder. Payments will not work."
  );
}

interface CheckoutPageProps {
  onNavigate?: (page: string, params?: NavigateParams) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate: onNavigateProp }) => {
  const [currentStep, setCurrentStep] = useState(
    Number(window.localStorage.getItem("checkoutStep")) || 1
  );
  const { user, loading: authLoading } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const navigate = useNavigate();

  const onNavigate =
    onNavigateProp ||
    ((path: string, params?: any) =>
      navigate(params ? `${path}?${new URLSearchParams(params)}` : path));

  const MOCK_CART_TOTAL_CENTS = 2599; // Replace with actual cart total from context or props

  const checkoutSteps = [
    { title: "Shipping", icon: Truck },
    { title: "Payment", icon: CreditCard },
    { title: "Review", icon: ShoppingBagIcon },
  ];

  // Persist currentStep to localStorage
  useEffect(() => {
    window.localStorage.setItem("checkoutStep", currentStep.toString());
  }, [currentStep]);

  // Effect for user authentication
  useEffect(() => {
    if (authLoading) return;
    if (!user && currentStep !== 0) {
      // Allow viewing if somehow on a non-checkout step
      showLoginPrompt({ returnUrl: "/checkout" }); // Redirect to checkout after login
    }
  }, [user, authLoading, showLoginPrompt, currentStep]);

  // --- Render Logic ---
  if (authLoading && !user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50">
        <p className="text-slate-600">Loading authentication...</p>
      </div>
    );
  }
  // If not logged in and auth is done loading, show prompt (handled by useEffect)
  // or a message if preferred. For now, useEffect handles redirection via prompt.
  if (!user && !authLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h1 className="text-2xl font-semibold text-slate-700 mb-3">Authentication Required</h1>
        <p className="text-slate-500 mb-6">
          Please log in to proceed with checkout. You should be redirected shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Checkout</h1>
        <CheckoutStepIndicator currentStep={currentStep} steps={checkoutSteps} />

        {/* Shipping Step */}
        {currentStep === 1 && user && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Shipping Information</h2>
            {/* Placeholder for Shipping Address Form */}
            <p className="text-slate-500">
              Shipping address form and selection will go here. (Placeholder)
            </p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => onNavigate("/cart")} // Assuming you have a cart page
                className="text-sm text-slate-600 hover:text-green-700 font-medium py-2 px-4 rounded-md border border-slate-300 hover:border-slate-400"
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

        {/* Payment Step */}
        {currentStep === 2 && user && (
          <PaymentStepManager
            stripePromise={stripePromise}
            user={user} // Pass user object for API calls if needed
            cartTotalCents={MOCK_CART_TOTAL_CENTS}
            onNavigateToReview={() => setCurrentStep(3)}
            onNavigateBackToShipping={() => setCurrentStep(1)}
            onSuccessfulPayment={(orderDetails) => {
              console.log("Payment successful, navigating to confirmation:", orderDetails);
              onNavigate("order-confirmation", { orderId: orderDetails.orderId });
            }}
          />
        )}

        {/* Review Step */}
        {currentStep === 3 && user && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Review Your Order</h2>
            {/* Placeholder for Order Review */}
            <p className="text-slate-500">
              Order summary, items, shipping, payment details for final review. (Placeholder)
            </p>
            <p className="text-slate-500 mt-2">
              Total: ${(MOCK_CART_TOTAL_CENTS / 100).toFixed(2)}
            </p>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-slate-600 hover:text-green-700 font-medium py-2 px-4 rounded-md border border-slate-300 hover:border-slate-400"
              >
                Back to Payment
              </button>
              <button
                // This button would typically trigger a final order placement API call
                // For now, it just navigates, assuming payment was handled in step 2
                onClick={() => {
                  // In a real app, you might make a final `placeOrder` API call here
                  // using the confirmed paymentIntentId from the payment step.
                  console.log("Placing order (mock)...");
                  onNavigate("order-confirmation", { orderId: `mockOrder_${Date.now()}` });
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

// Export default if it's the main export of the file
export default CheckoutPage;
