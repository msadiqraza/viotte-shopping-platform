// src/pages/CreditsPage.tsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Gift,
  CheckCircle,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed
import { useLoginPrompt } from "../contexts/LoginPromptContext"; // Adjust path as needed
import {
  getUserCredit,
  requestCreditForActivity,
  AuthenticationRequiredError,
} from "../services/creditApis"; // Adjust path
import { NavigateParams } from "../types";

interface CreditsPageProps {
  onNavigate?: (page: string, params?: NavigateParams) => void;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [currentCredit, setCurrentCredit] = useState<number | null>(null);
  const [isLoadingCredit, setIsLoadingCredit] = useState(true);
  const [activityMessage, setActivityMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) {
      setIsLoadingCredit(true);
      return;
    }
    if (!user) {
      setIsLoadingCredit(false);
      showLoginPrompt({ returnUrl: "/credits" });
      return;
    }

    setIsLoadingCredit(true);
    getUserCredit()
      .then((data) => {
        if (data) {
          setCurrentCredit(data.credit);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch credit:", error);
        if (error instanceof AuthenticationRequiredError) {
          showLoginPrompt({ returnUrl: "/credits" });
        }
        // Handle other errors if needed
      })
      .finally(() => setIsLoadingCredit(false));
  }, [user, authLoading, showLoginPrompt]);

  const handleRequestCredit = async (activityType: string, details?: Record<string, any>) => {
    if (!user) {
      showLoginPrompt({ returnUrl: "/credits" });
      return;
    }
    setActivityMessage(null);
    try {
      const result = await requestCreditForActivity(activityType, details);
      if (result.success) {
        setActivityMessage({ type: "success", text: result.message });
      } else {
        setActivityMessage({ type: "error", text: result.message || "Failed to process request." });
      }
    } catch (error: any) {
      setActivityMessage({ type: "error", text: error.message || "An unexpected error occurred." });
    }
  };

  const earnCreditOptions = [
    {
      id: "daily_checkin",
      title: "Daily Check-in",
      description: "Earn 5 credits for checking in daily.",
      icon: CheckCircle,
      action: () => handleRequestCredit("Daily Check-in"),
    },
    {
      id: "follow_twitter",
      title: "Follow on Twitter",
      description: "Earn 10 credits.",
      icon: Twitter,
      action: () => handleRequestCredit("Follow on Twitter", { platform: "Twitter" }),
    },
    {
      id: "like_facebook",
      title: "Like on Facebook",
      description: "Earn 10 credits.",
      icon: Facebook,
      action: () => handleRequestCredit("Like on Facebook", { platform: "Facebook" }),
    },
    {
      id: "follow_instagram",
      title: "Follow on Instagram",
      description: "Earn 10 credits.",
      icon: Instagram,
      action: () => handleRequestCredit("Follow on Instagram", { platform: "Instagram" }),
    },
    {
      id: "refer_friend",
      title: "Refer a Friend",
      description: "Earn 50 credits when your friend signs up.",
      icon: Gift,
      action: () => handleRequestCredit("Refer a Friend"),
    },
  ];

  if (authLoading || isLoadingCredit) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50">
        <p className="text-slate-700">Loading your credits...</p>
      </div>
    );
  }

  if (!user) {
    // Login prompt is active, or user will be redirected by AuthProvider/LoginPromptProvider
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <DollarSign size={64} className="text-slate-300 mb-6" />
        <h1 className="text-2xl font-semibold text-slate-700 mb-3">View Your Credits</h1>
        <p className="text-slate-500 mb-6">
          Please log in to see your credit balance and earning opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <DollarSign size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Your Credits</h1>
          <p className="text-6xl font-extrabold text-green-600">
            {currentCredit !== null ? currentCredit.toLocaleString() : "---"}
          </p>
          <p className="text-slate-600 mt-1">points available</p>
        </div>

        {activityMessage && (
          <div
            className={`p-4 mb-6 rounded-md text-sm text-center border ${
              activityMessage.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {activityMessage.text}
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
            Ways to Earn More Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnCreditOptions.map((option) => (
              <div
                key={option.id}
                className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col items-center text-center"
              >
                <option.icon size={36} className="text-orange-500 mb-3" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{option.title}</h3>
                <p className="text-sm text-slate-600 mb-4 flex-grow">{option.description}</p>
                <button
                  onClick={option.action}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                >
                  Claim Credits
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate?.("")} // Navigate to homepage
            className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center mx-auto"
          >
            <ExternalLink size={18} className="mr-2" />
            Explore Store
          </button>
        </div>
      </main>
    </div>
  );
};
