// src/components/accounts/PaymentMethodsSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { PaymentMethod } from "../../types";
import {
  getUserPaymentMethods,
  deleteUserPaymentMethod,
  setDefaultUserPaymentMethod,
  createStripeSetupIntent,
  savePaymentMethod,
} from "../../services/paymentApis"; // Adjust path
import { AuthenticationRequiredError } from "../../services/creditApis";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import { useLoginPrompt } from "../../contexts/LoginPromptContext"; // Adjust path
import {
  CreditCard,
  PlusCircle,
  Trash2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Ensure your VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

interface AddStripeCardFormProps {
  clientSecret: string;
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
}

const AddStripeCardForm: React.FC<AddStripeCardFormProps> = ({
  clientSecret,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found.");
      setIsProcessing(false);
      return;
    }

    const { error: setupError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        // billing_details: { name: 'Jenny Rosen' }, // Optional: Collect billing details
      },
    });

    if (setupError) {
      setError(setupError.message || "An unexpected error occurred during card setup.");
      setIsProcessing(false);
      return;
    }

    if (setupIntent && setupIntent.payment_method && setupIntent.status === "succeeded") {
      onSuccess(setupIntent.payment_method as string);
    } else {
      setError("Card setup did not succeed. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-slate-700 mb-1">
          Card Details
        </label>
        <div className="p-3 border border-slate-300 rounded-md bg-white">
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-70"
        >
          {isProcessing ? "Saving..." : "Save Card"}
        </button>
      </div>
    </form>
  );
};

export const PaymentMethodsSection: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState<string | null>(null);
  const [isCreatingSetupIntent, setIsCreatingSetupIntent] = useState(false);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      showLoginPrompt({ returnUrl: "/account?tab=payment-methods" });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const methods = await getUserPaymentMethods(); // Using mocked API
      setPaymentMethods(methods);
    } catch (err: any) {
      console.error("Failed to fetch payment methods:", err);
      if (err instanceof AuthenticationRequiredError) {
        showLoginPrompt({ returnUrl: "/account?tab=payment-methods" });
      } else {
        setError(err.message || "Could not load payment methods.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, showLoginPrompt]);

  useEffect(() => {
    if (!authLoading) {
      fetchPaymentMethods();
    }
  }, [user, authLoading, fetchPaymentMethods]);

  const handleAddNewCard = async () => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=payment-methods" });
      return;
    }
    setIsCreatingSetupIntent(true);
    setError(null);
    try {
      const { clientSecret } = await createStripeSetupIntent(); // Mocked API
      setSetupIntentClientSecret(clientSecret);
      setShowAddCardForm(true);
    } catch (err: any) {
      console.error("Failed to create Stripe SetupIntent:", err);
      setError(err.message || "Could not initialize card setup. Please try again.");
    } finally {
      setIsCreatingSetupIntent(false);
    }
  };

  const handleCardSaveSuccess = async (stripePaymentMethodId: string) => {
    try {
      await savePaymentMethod({ type: "stripe", stripePaymentMethodId }); // Mocked API
      setShowAddCardForm(false);
      setSetupIntentClientSecret(null);
      fetchPaymentMethods(); // Refresh list
    } catch (err: any) {
      console.error("Failed to save payment method to backend:", err);
      setError(err.message || "Could not save your card. Please try again.");
      // Keep form open with error if savePaymentMethod fails
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=payment-methods" });
      return;
    }
    if (window.confirm("Are you sure you want to remove this payment method?")) {
      try {
        await deleteUserPaymentMethod(methodId); // Mocked API
        fetchPaymentMethods();
      } catch (err: any) {
        setError(err.message || "Could not remove payment method.");
      }
    }
  };

  const handleSetDefault = async (methodId: string) => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/account?tab=payment-methods" });
      return;
    }
    try {
      await setDefaultUserPaymentMethod(methodId); // Mocked API
      fetchPaymentMethods(); // Refresh to show new default
    } catch (err: any) {
      setError(err.message || "Could not set default payment method.");
    }
  };

  if (authLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading authentication...</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p>Loading payment methods...</p>
      </div>
    );
  }
  if (!user && !authLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Required</h2>
        <p className="text-slate-600">Please log in to manage your payment methods.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Payment Methods</h2>
        {!showAddCardForm && (
          <button
            onClick={handleAddNewCard}
            disabled={isCreatingSetupIntent}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center text-sm transition-colors disabled:opacity-70"
          >
            <PlusCircle size={18} className="mr-2" />{" "}
            {isCreatingSetupIntent ? "Initializing..." : "Add New Card"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          <AlertTriangle size={18} className="inline mr-2" /> {error}
        </div>
      )}

      {showAddCardForm && setupIntentClientSecret && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Add New Card (Stripe)</h3>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: setupIntentClientSecret, appearance: { theme: "stripe" } }}
          >
            <AddStripeCardForm
              clientSecret={setupIntentClientSecret}
              onSuccess={handleCardSaveSuccess}
              onCancel={() => {
                setShowAddCardForm(false);
                setSetupIntentClientSecret(null);
              }}
            />
          </Elements>
        </div>
      )}

      {paymentMethods.length === 0 && !isLoading && !showAddCardForm && (
        <div className="text-center py-10">
          <CreditCard size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500">You have no saved payment methods.</p>
        </div>
      )}

      {!showAddCardForm && paymentMethods.length > 0 && (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 border border-slate-200 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="flex items-center">
                  <CreditCard size={20} className="mr-3 text-slate-500" />
                  <span className="font-medium text-slate-700">
                    {method.brand
                      ? `${method.brand} ending in ${method.last4}`
                      : method.email || "PayPal Account"}
                  </span>
                  {method.is_default && (
                    <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 ml-8">
                  Added: {new Date(method.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Link PayPal Account</h3>
        <p className="text-sm text-slate-600 mb-4">
          Securely link your PayPal account to use it for future purchases.
        </p>
        <button
          // onClick={handleLinkPayPal} // You'd implement this
          disabled // Placeholder
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md flex items-center text-sm transition-colors disabled:opacity-50"
        >
          <ExternalLink size={16} className="mr-2" /> Link PayPal (Coming Soon)
        </button>
      </div>
    </div>
  );
};
