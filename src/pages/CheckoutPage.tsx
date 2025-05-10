// src/pages/CheckoutPage.tsx
import React, { useState } from "react"; // Already imported
import { Truck, CreditCard, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { CheckoutStepIndicator } from "../components/checkout/CheckoutStepIndicator";

interface CheckoutPageProps {
  onNavigate?: (page: string, params?: any) => void;
}
export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const checkoutSteps = [
    { title: "Shipping", icon: Truck },
    { title: "Payment", icon: CreditCard },
    { title: "Review", icon: ShoppingBagIcon },
  ];

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
              <button onClick={() => onNavigate?.("cart")} className="text-sm text-slate-600 hover:text-green-700 font-medium">
                Back to Cart
              </button>
              <button onClick={() => setCurrentStep(2)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md">
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
              <button onClick={() => setCurrentStep(1)} className="text-sm text-slate-600 hover:text-green-700 font-medium">
                Back to Shipping
              </button>
              <button onClick={() => setCurrentStep(3)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md">
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
              <button onClick={() => setCurrentStep(2)} className="text-sm text-slate-600 hover:text-green-700 font-medium">
                Back to Payment
              </button>
              <button
                onClick={() => {
                  alert("Order Placed (Mock)!");
                  onNavigate?.("order-confirmation", { orderId: "mockOrder123" });
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
