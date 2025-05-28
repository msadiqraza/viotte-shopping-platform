// src/pages/JoinSellerPage.tsx
import React, { useState, useEffect } from "react";
import { Briefcase, User, Mail, FileText, Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Adjust path
import { useLoginPrompt } from "../contexts/LoginPromptContext"; // Adjust path
import {
  submitSellerApplication,
  getMySellerApplication,
  SellerApplicationData,
  SellerApplication,
} from "../services/sellerApis"; // Adjust path
import { AuthenticationRequiredError } from "../services/creditApis";

interface JoinSellerPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const JoinSellerPage: React.FC<JoinSellerPageProps> = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [formData, setFormData] = useState<SellerApplicationData>({
    businessName: "",
    applicationDetails: "",
    contactEmail: "",
  });
  const [existingApplication, setExistingApplication] = useState<SellerApplication | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) {
      setIsLoadingApplication(true);
      return;
    }
    if (!user) {
      setIsLoadingApplication(false);
      showLoginPrompt({ returnUrl: "/join-seller" });
      return;
    }

    // Pre-fill email and fetch existing application
    setFormData((prev) => ({ ...prev, contactEmail: user.email || "" }));
    setIsLoadingApplication(true);
    getMySellerApplication()
      .then(setExistingApplication)
      .catch((error) => {
        console.error("Error fetching existing application:", error);
        // Non-critical, proceed to allow new application if none found
      })
      .finally(() => setIsLoadingApplication(false));
  }, [user, authLoading, showLoginPrompt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showLoginPrompt({ returnUrl: "/join-seller" });
      return;
    }
    setIsSubmitting(true);
    setFormMessage(null);
    try {
      const submittedApp = await submitSellerApplication(formData);
      setFormMessage({
        type: "success",
        text: "Your application has been submitted successfully! We will review it and get back to you.",
      });
      setExistingApplication(submittedApp); // Update state to show submitted application
      // setFormData({ businessName: '', applicationDetails: '', contactEmail: user.email || '' }); // Optionally reset form
    } catch (error: any) {
      if (error instanceof AuthenticationRequiredError) {
        showLoginPrompt({ returnUrl: "/join-seller" });
        setFormMessage({ type: "error", text: "Please log in to submit an application." });
      } else {
        setFormMessage({
          type: "error",
          text: error.message || "Failed to submit application. Please try again.",
        });
      }
    }
    setIsSubmitting(false);
  };

  if (authLoading || isLoadingApplication) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50">
        <p className="text-slate-700">Loading application status...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <Briefcase size={64} className="text-slate-300 mb-6" />
        <h1 className="text-2xl font-semibold text-slate-700 mb-3">Want to Sell With Us?</h1>
        <p className="text-slate-500 mb-6">
          Log in or create an account to start your seller application.
        </p>
      </div>
    );
  }

  if (existingApplication) {
    return (
      <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase size={64} className="mx-auto text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Application Submitted</h1>
          <p className="text-slate-600 mb-3">
            Thank you for your interest! We have received your application to become a seller.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-left space-y-3 mb-6">
            <p>
              <strong className="text-slate-700">Business Name:</strong>{" "}
              {existingApplication.businessName}
            </p>
            <p>
              <strong className="text-slate-700">Contact Email:</strong>{" "}
              {existingApplication.contactEmail}
            </p>
            <p>
              <strong className="text-slate-700">Status:</strong>{" "}
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  existingApplication.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : existingApplication.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {existingApplication.status.charAt(0).toUpperCase() +
                  existingApplication.status.slice(1)}
              </span>
            </p>
            <p>
              <strong className="text-slate-700">Submitted:</strong>{" "}
              {new Date(existingApplication.submittedAt).toLocaleDateString()}
            </p>
            {existingApplication.reviewerNotes && (
              <p>
                <strong className="text-slate-700">Reviewer Notes:</strong>{" "}
                {existingApplication.reviewerNotes}
              </p>
            )}
          </div>
          <p className="text-sm text-slate-500">
            We will notify you via email once your application has been reviewed.
          </p>
          <button
            onClick={() => onNavigate?.("")}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md transition-colors"
          >
            Back to Homepage
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Briefcase size={56} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Become a Seller</h1>
          <p className="mt-3 text-lg text-slate-600">
            Join our platform and reach thousands of customers. Fill out the form below to get
            started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 space-y-6"
        >
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">
              Business Name / Shop Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="businessName"
                id="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                placeholder="e.g., The Crafty Corner"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="applicationDetails"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Tell Us About Your Business (Optional)
            </label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
              <textarea
                name="applicationDetails"
                id="applicationDetails"
                value={formData.applicationDetails}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                placeholder="Describe your products, your business story, links to existing shops, etc."
              ></textarea>
            </div>
          </div>

          {formMessage && (
            <p
              className={`text-sm p-3 rounded-md border ${
                formMessage.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {formMessage.text}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 disabled:opacity-70"
            >
              <Send size={18} className="mr-2" />{" "}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            By submitting this application, you agree to our platform's terms and conditions for
            sellers.
          </p>
        </form>
      </main>
    </div>
  );
};
