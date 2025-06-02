// src/components/checkout/PaymentStepManager.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { AlertTriangle, CreditCard, PlusCircle } from "lucide-react";

import { User } from "@supabase/supabase-js"; // Assuming User type from Supabase
import { PaymentMethod, StripeIntentResponse, NewPaymentMethodData } from "../../types"; // Adjust path
import {
  getUserPaymentMethods,
  createPaymentIntent as apiCreatePaymentIntent,
  createStripeSetupIntent as apiCreateStripeSetupIntent,
  savePaymentMethod as apiSavePaymentMethod,
} from "../../services/paymentApis"; // Adjust path

import StripeCheckoutForm from "./StripeCheckoutForm"; // Assuming this is the user's provided component

// Define the appearance for Stripe Elements
const stripeAppearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0570de", // Example: Blue primary color
    colorBackground: "#ffffff",
    colorText: "#30313d",
    colorDanger: "#df1b41",
    fontFamily: "Ideal Sans, system-ui, sans-serif",
    spacingUnit: "2px",
    borderRadius: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #E0E6EB",
      boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,0.05)",
    },
    ".Input:focus": {
      borderColor: "#0570de",
      boxShadow: "0 0 0 1px #0570de",
    },
  },
};

// Props for PaymentStepManager
interface PaymentStepManagerProps {
  stripePromise: ReturnType<typeof loadStripe>;
  user: User;
  cartTotalCents: number;
  onNavigateToReview: () => void;
  onNavigateBackToShipping: () => void;
  onSuccessfulPayment: (orderDetails: { orderId: string; paymentIntentId: string }) => void;
}

// Internal state machine for the payment step
type PaymentMode =
  | "LOADING_METHODS" // Initial state, fetching saved payment methods
  | "SELECT_METHOD" // User can select from saved methods or choose to add a new one
  | "ADD_NEW_METHOD" // User is in the process of adding a new payment method
  | "CREATING_INTENT" // Waiting for backend to create PaymentIntent or SetupIntent
  | "INTENT_READY" // Client secret received, Stripe form can be shown
  | "PROCESSING_STRIPE" // Stripe.js is processing the payment/setup
  | "SAVING_NEW_METHOD" // New card setup done, saving it to our backend
  | "ERROR_STATE"; // An error occurred

export const PaymentStepManager: React.FC<PaymentStepManagerProps> = ({
  stripePromise,
  user,
  cartTotalCents,
  onNavigateToReview,
  onNavigateBackToShipping,
  onSuccessfulPayment,
}) => {
  const [mode, setMode] = useState<PaymentMode>("LOADING_METHODS");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const [activeClientSecret, setActiveClientSecret] = useState<string | null>(null);
  const [activeIntentType, setActiveIntentType] = useState<"payment" | "setup" | null>(null);

  // --- Effect to load saved payment methods ---
  useEffect(() => {
    if (mode === "LOADING_METHODS" && user) {
      setErrorMessage(null); // Clear previous errors
      setActiveClientSecret(null); // Clear previous secrets
      getUserPaymentMethods()
        .then((methods) => {
          setSavedMethods(methods);
          if (methods.length > 0) {
            // Auto-select the default or the first card
            const defaultMethod = methods.find((m) => m.is_default) || methods[0];
            setSelectedMethodId(defaultMethod.id);
            setMode("SELECT_METHOD"); // Proceed to select mode
          } else {
            setMode("ADD_NEW_METHOD"); // No saved methods, go directly to add new
          }
        })
        .catch((err) => {
          console.error("Error fetching payment methods:", err);
          setErrorMessage(err.message || "Could not load your saved payment methods.");
          setMode("ERROR_STATE");
        });
    }
  }, [mode, user]);

  // --- Effect to create intents (PaymentIntent or SetupIntent) ---
  useEffect(() => {
    if (!user) return;

    // If in ADD_NEW_METHOD mode and no client secret yet, create SetupIntent
    if (mode === "ADD_NEW_METHOD" && !activeClientSecret) {
      setMode("CREATING_INTENT");
      setErrorMessage(null);
      apiCreateStripeSetupIntent()
        .then((response: StripeIntentResponse) => {
          if (response.error || !response.clientSecret) {
            throw new Error(response.error || "Failed to initialize card form.");
          }
          setActiveClientSecret(response.clientSecret);
          setActiveIntentType("setup");
          setMode("INTENT_READY");
        })
        .catch((err) => {
          console.error("Error creating SetupIntent:", err);
          setErrorMessage(err.message || "Could not prepare to add a new card.");
          setMode("ERROR_STATE");
        });
    }
    // If in SELECT_METHOD mode, a method is selected, and no client secret yet, create PaymentIntent
    else if (mode === "SELECT_METHOD" && selectedMethodId && !activeClientSecret) {
      setMode("CREATING_INTENT");
      setErrorMessage(null);
      apiCreatePaymentIntent(cartTotalCents, "usd", selectedMethodId)
        .then((response: StripeIntentResponse) => {
          if (response.error || !response.clientSecret) {
            throw new Error(response.error || "Failed to initialize payment for selected card.");
          }
          setActiveClientSecret(response.clientSecret);
          setActiveIntentType("payment");
          setMode("INTENT_READY");
        })
        .catch((err) => {
          console.error("Error creating PaymentIntent:", err);
          setErrorMessage(err.message || "Could not prepare payment for the selected card.");
          setMode("ERROR_STATE");
        });
    }
  }, [mode, user, selectedMethodId, activeClientSecret, cartTotalCents]);

  // --- Event Handlers ---
  const handleSelectSavedMethod = (pmId: string) => {
    if (pmId !== selectedMethodId || mode !== "SELECT_METHOD") {
      setSelectedMethodId(pmId);
      setActiveClientSecret(null); // Force re-fetching of PaymentIntent
      setMode("SELECT_METHOD");
    }
  };

  const handleAddNewMethodClick = () => {
    setSelectedMethodId(null); // Deselect any saved card
    setActiveClientSecret(null); // Force re-fetching of SetupIntent
    setMode("ADD_NEW_METHOD");
  };

  const handleCancelAddNewMethod = () => {
    // If there are saved methods, go back to selecting one, otherwise, it's an error or reload.
    if (savedMethods.length > 0) {
      // Reselect the previously selected or the first one
      const prevSelected = selectedMethodId || savedMethods[0]?.id;
      if (prevSelected) {
        handleSelectSavedMethod(prevSelected);
      } else {
        // Should not happen if savedMethods > 0 but no selection
        setMode("LOADING_METHODS");
      }
    } else {
      // No saved methods to go back to, might indicate a need to reload or an error
      // For simplicity, try reloading methods. A more specific error or state might be better.
      setMode("LOADING_METHODS");
    }
  };

  const handleStripeFormProcessing = (isProcessing: boolean) => {
    if (isProcessing) {
      setMode("PROCESSING_STRIPE");
      setErrorMessage(null); // Clear errors when Stripe starts processing
    } else if (mode === "PROCESSING_STRIPE") {
      // If Stripe stops processing and we are still in PROCESSING_STRIPE mode,
      // it implies the form submission was cancelled or an internal Stripe error occurred
      // before onSubmitOrder was called. Reset to allow user to try again.
      // StripeCheckoutForm should set its own error for this.
      // We reset our mode to INTENT_READY to show the form again.
      setMode("INTENT_READY");
    }
  };

  const handleStripeFormSubmitOrder = async (
    paymentIntentIdFromStripe?: string, // For payment intents
    stripePaymentMethodId?: string // For setup intents (newly created PM ID by Stripe)
  ) => {
    if (activeIntentType === "setup" && stripePaymentMethodId) {
      setMode("SAVING_NEW_METHOD");
      try {
        const newMethodData: NewPaymentMethodData = {
          stripePaymentMethodId: stripePaymentMethodId,
          type: "card", // Or determine dynamically if supporting other types
          isDefault: savedMethods.length === 0, // Make first card default
          // cardDetails: {} // You might get brand/last4 from Stripe Elements to store
        };
        const savedNewPM = await apiSavePaymentMethod(newMethodData);
        // Add to local list and select it
        setSavedMethods((prev) =>
          [savedNewPM, ...prev.filter((p) => p.id !== savedNewPM.id)].sort(
            (a, b) => Number(b.is_default) - Number(a.is_default)
          )
        );
        setSelectedMethodId(savedNewPM.id);
        setActiveClientSecret(null); // Clear setup intent secret
        setMode("SELECT_METHOD"); // Switch to select mode, will trigger PI for the new card
        // User will then see the payment form for this newly added card and can click "Pay"
      } catch (err: any) {
        console.error("Error saving new payment method:", err);
        setErrorMessage(err.message || "Could not save your new payment card. Please try again.");
        setMode("ERROR_STATE"); // Or back to ADD_NEW_METHOD with error
      }
    } else if (activeIntentType === "payment" && paymentIntentIdFromStripe) {
      // Payment successful
      onSuccessfulPayment({
        orderId: `mockOrder_${Date.now()}`, // Replace with actual order ID generation
        paymentIntentId: paymentIntentIdFromStripe,
      });
      // The parent (CheckoutPage) will navigate to order confirmation.
      // Reset state here if needed, though component might unmount.
      setMode("LOADING_METHODS"); // Reset for potential future use
      setActiveClientSecret(null);
    } else {
      // This case should ideally not be reached if StripeCheckoutForm behaves as expected
      console.warn("Stripe form submission returned unexpected data:", {
        paymentIntentIdFromStripe,
        stripePaymentMethodId,
        activeIntentType,
      });
      setErrorMessage("An unexpected issue occurred with the payment form. Please try again.");
      setMode("ERROR_STATE");
    }
  };

  const handleRetry = () => {
    setErrorMessage(null);
    // Attempt to recover based on the last logical step
    if (activeIntentType === "setup" || savedMethods.length === 0) {
      setActiveClientSecret(null); // Force re-fetch
      setMode("ADD_NEW_METHOD");
    } else if (activeIntentType === "payment" && selectedMethodId) {
      setActiveClientSecret(null); // Force re-fetch
      setMode("SELECT_METHOD");
    } else {
      setMode("LOADING_METHODS"); // Default retry: reload payment methods
    }
  };

  // --- Render Helper for Stripe Form ---
  const renderStripeForm = () => {
    if (!activeClientSecret || !activeIntentType) {
      return <p className="text-center text-slate-500">Initializing Stripe form...</p>;
    }
    const elementsOptions: StripeElementsOptions = {
      clientSecret: activeClientSecret,
      appearance: stripeAppearance,
    };
    return (
      <Elements stripe={stripePromise} options={elementsOptions}>
        <StripeCheckoutForm
          clientSecret={activeClientSecret} // This is now correctly passed
          intentType={activeIntentType}
          onProcessing={handleStripeFormProcessing}
          onSubmitOrder={handleStripeFormSubmitOrder}
          cartTotal={cartTotalCents}
        />
      </Elements>
    );
  };

  // --- Main Render Logic for PaymentStepManager ---
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">Payment Details</h2>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 border border-red-200 flex flex-col items-center">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2 text-red-600" />
            <p className="font-medium">Error:</p>
          </div>
          <p className="text-sm text-center mt-1 mb-3">{errorMessage}</p>
          <button
            onClick={handleRetry}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}

      {mode === "LOADING_METHODS" && !errorMessage && (
        <p className="text-center text-slate-500 py-4">Loading your payment methods...</p>
      )}
      {mode === "CREATING_INTENT" && !errorMessage && (
        <p className="text-center text-slate-500 py-4">Preparing payment form...</p>
      )}
      {mode === "PROCESSING_STRIPE" && !errorMessage && (
        <p className="text-center text-slate-500 py-4">Processing with Stripe...</p>
      )}
      {mode === "SAVING_NEW_METHOD" && !errorMessage && (
        <p className="text-center text-slate-500 py-4">Saving your new card...</p>
      )}

      {/* Display saved methods if available and not adding new */}
      {(mode === "SELECT_METHOD" || (mode === "INTENT_READY" && activeIntentType === "payment")) &&
        savedMethods.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-slate-600 mb-3">Your Saved Payment Methods:</h3>
            <div className="space-y-3">
              {savedMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150 ease-in-out hover:border-green-500 ${
                    selectedMethodId === method.id
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="savedPaymentMethod"
                    value={method.id}
                    checked={selectedMethodId === method.id}
                    onChange={() => handleSelectSavedMethod(method.id)}
                    className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <CreditCard size={20} className="mx-3 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {method.brand
                      ? `${method.brand} ending in ${method.last4}`
                      : method.email || "Unknown Card"}
                  </span>
                  {method.is_default && (
                    <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </label>
              ))}
            </div>
            <button
              onClick={handleAddNewMethodClick}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <PlusCircle size={16} className="mr-1" /> Add a new payment method
            </button>
          </div>
        )}

      {/* Show Stripe form when intent is ready (for payment or setup) */}
      {mode === "INTENT_READY" && activeClientSecret && (
        <div className="mt-4">
          {activeIntentType === "payment" && (
            <h3 className="text-md font-medium text-slate-600 mb-3">Confirm Payment:</h3>
          )}
          {activeIntentType === "setup" && (
            <h3 className="text-md font-medium text-slate-600 mb-3">Add New Card:</h3>
          )}
          {renderStripeForm()}
          {activeIntentType === "setup" && savedMethods.length > 0 && (
            <button
              onClick={handleCancelAddNewMethod}
              className="mt-4 text-sm text-slate-600 hover:text-slate-800"
            >
              ← Cancel and use a saved card
            </button>
          )}
        </div>
      )}

      {/* Show "Add new payment method" button if no saved methods and currently not adding/error */}
      {(mode === "SELECT_METHOD" || mode === "LOADING_METHODS") &&
        savedMethods.length === 0 &&
        !errorMessage && (
          <div className="text-center py-4">
            <p className="text-slate-500 mb-3">You have no saved payment methods.</p>
            <button
              onClick={handleAddNewMethodClick}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md flex items-center justify-center mx-auto"
            >
              <PlusCircle size={18} className="mr-2" /> Add Payment Method
            </button>
          </div>
        )}

      {/* Navigation Buttons */}
      {!errorMessage &&
        mode !== "LOADING_METHODS" &&
        mode !== "CREATING_INTENT" &&
        mode !== "PROCESSING_STRIPE" &&
        mode !== "SAVING_NEW_METHOD" && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={onNavigateBackToShipping}
              className="text-sm text-slate-600 hover:text-green-700 font-medium py-2 px-4 rounded-md border border-slate-300 hover:border-slate-400"
            >
              Back to Shipping
            </button>
            {/* "Next: Review Order" button is only enabled if a payment method is selected and ready (not adding new) */}
            {/* OR if a new card was just added and now selected.
              The actual payment happens via the Stripe form's submit button.
              This button here is more for conceptual navigation IF payment was pre-authorized
              or for a different flow. In this Stripe Elements flow, the "Pay" button
              inside the Stripe form is the primary action for payment.
              We can repurpose this "Next" button to be disabled until a payment method is confirmed.
              For now, let's assume payment happens via Stripe form, and review is next.
          */}
            <button
              onClick={onNavigateToReview}
              disabled={
                mode === "ADD_NEW_METHOD" || // Can't proceed if actively adding a new card without saving
                !selectedMethodId || // Can't proceed if no card is selected (after adding one, it gets selected)
                (activeIntentType === "payment" && !activeClientSecret) // If trying to pay but PI not ready
              }
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Review Order
            </button>
          </div>
        )}
    </div>
  );
};
