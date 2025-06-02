// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { Lock } from "lucide-react";
import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS_CHECKOUT = {
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

interface CheckoutPaymentFormProps {
  clientSecret: string; // For PaymentIntent or SetupIntent
  intentType: "payment" | "setup";
  onProcessing: (isProcessing: boolean) => void;
  onSubmitOrder: (paymentIntentId?: string, paymentMethodId?: string) => void; // Callback on successful payment/setup
  cartTotal: number; // For display
}

const StripeCheckoutForm: React.FC<CheckoutPaymentFormProps> = ({
  clientSecret,
  intentType,
  onProcessing,
  onSubmitOrder,
  cartTotal,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    onProcessing(true);
    setError(null);

    if (intentType === "payment") {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "An unexpected error occurred.");
        setIsSubmitting(false);
        onProcessing(false);
        return;
      }
      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSubmitOrder(paymentIntent.id);
      } else if (paymentIntent) {
        setError(
          `Payment status: ${paymentIntent.status}. Please follow any instructions provided.`
        );
      } else {
        console.log("PaymentIntent after confirm (no redirect):", paymentIntent);
      }
    } else if (intentType === "setup") {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found.");
        setIsSubmitting(false);
        onProcessing(false);
        return;
      }
      const { error: setupError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (setupError) {
        setError(setupError.message || "Failed to save card.");
      } else if (setupIntent && setupIntent.payment_method && setupIntent.status === "succeeded") {
        onSubmitOrder(undefined, setupIntent.payment_method as string);
      } else {
        setError("Card setup did not succeed.");
      }
    }
    setIsSubmitting(false);
    onProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {intentType === "payment" ? (
        <PaymentElement />
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Card Details</label>
          <div className="p-3 border border-slate-300 rounded-md bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS_CHECKOUT} />
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
      >
        <Lock size={18} className="mr-2" />
        {isSubmitting
          ? "Processing..."
          : intentType === "payment"
          ? `Pay $${(cartTotal / 100).toFixed(2)}`
          : "Save and Use Card"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
