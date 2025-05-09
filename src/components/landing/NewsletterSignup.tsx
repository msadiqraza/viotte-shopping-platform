// -----------------------------------------------------------------------------
// 9. components/landing/NewsletterSignup.tsx
// Description: Newsletter signup form for the footer area.
// -----------------------------------------------------------------------------
// Create this file in `src/components/landing/NewsletterSignup.tsx`

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { subscribeToNewsletter } from "../../services/api"; // Adjust path

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await subscribeToNewsletter(email);
      setMessage(response.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h5 className="text-lg font-semibold text-white mb-3">Subscribe for our Newsletters</h5>
      <p className="text-sm text-green-200 mb-3">Get updates on new arrivals, special offers, and more.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow max-w-[350px]">
          <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-100 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-white placeholder-white text-white rounded-md py-2.5 px-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-5 rounded-md text-sm font-semibold transition-colors duration-150 whitespace-nowrap disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-green-300">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
