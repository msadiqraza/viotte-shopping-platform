// src/pages/AccountPage.tsx
import React, { useState, useEffect } from "react";
import { UserAccountDetails } from "../types";
import { getUserAccountDetails, updateUserAccountDetails } from "../services/accountApis";
import { AccountPageLayout } from "../components/accounts/AccountPageLayout";
import { PersonalInfoSection } from "../components/accounts/PersonalInfoSection";
import { CollectionSection } from "../components/accounts/CollectionSection";
import { OrdersSection } from "../components/accounts/OrdersSection";
import { ManageAddressesSection } from "../components/accounts/ManageAddressesSection";
import { PaymentMethodsSection } from "../components/accounts/PaymentMethodsSection";
import { AccountPageProps, AccountTabId } from "../types";

import { useAuth } from "../contexts/AuthContext"; // Assuming path
import { useLoginPrompt } from "../contexts/LoginPromptContext";

export const AccountPage: React.FC<AccountPageProps> = ({
  initialTab = "personal-info",
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AccountTabId>(initialTab);
  const [userDetails, setUserDetails] = useState<UserAccountDetails | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(true);

  const auth = useAuth();
  const { showLoginPrompt } = useLoginPrompt();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // useEffect(() => {
  //   // TODO: handle better
  //   if (!userDetails) {
  //     // getCurrentUserId()
  //     //   .then((userId) => {
  //     //     if (userId) {
  //     //       onNavigate?.("login");
  //     //       return;
  //     //     }
  //     //   })
  //     //   .catch((err: Error) => console.error("Failed to get user ID", err));

  //     setIsLoadingUserDetails(true);
  //     getUserAccountDetails()
  //       .then(setUserDetails)
  //       .catch((err: Error) => console.error("Failed to load user details", err))
  //       .finally(() => setIsLoadingUserDetails(false));
  //   }
  // }, [userDetails]);

  useEffect(() => {
    if (auth.loading) {
      setIsLoadingUserDetails(true);
      return;
    }

    if (!auth.user) {
      setUserDetails(null);
      setIsLoadingUserDetails(false);
      // Prompt to login, pass current path for redirection after login
      showLoginPrompt({ returnUrl: "/account" });
    } else {
      setIsLoadingUserDetails(true); //
      getUserAccountDetails() //
        .then(setUserDetails) //
        .catch((err: Error) => {
          console.error("Failed to load user details", err); //
          // Handle cases like token expired or profile not found for an authenticated user
          if (err.message.includes("User not authenticated")) {
            // Or specific error code
            auth.signOut(); // Force sign out if session is invalid
            showLoginPrompt({ returnUrl: "/account" });
          }
        })
        .finally(() => setIsLoadingUserDetails(false)); //
    }
  }, [auth.user, auth.loading, showLoginPrompt]);

  const handleUpdateUserDetails = async (details: Partial<UserAccountDetails>) => {
    if (!auth.user) {
      showLoginPrompt({ returnUrl: "/account" });
      return { success: false, message: "User not authenticated." };
    }
    try {
      const response = await updateUserAccountDetails(details); //
      if (response.success && response.updatedDetails) {
        setUserDetails(response.updatedDetails); //
        return { success: true, updatedDetails: response.updatedDetails }; //
      }
      return { success: false, message: "Update failed." }; //
    } catch (error) {
      console.error("Error updating user details", error); //
      return { success: false, message: (error as Error).message }; //
    }
  };

  // Render loading or prompt state if user details are not available yet and auth is being checked.
  if (auth.loading || (isLoadingUserDetails && !auth.user && !userDetails)) {
    return (
      <AccountPageLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="p-8 text-center">Loading Account Information...</div>
      </AccountPageLayout>
    );
  }
  // If not loading auth and user is still not available (after prompt effect has run)
  // The modal will be visible, or you can show a placeholder here.
  if (!auth.user && !auth.loading) {
    return (
      <AccountPageLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="p-8 text-center">Please log in to view your account details.</div>
      </AccountPageLayout>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <PersonalInfoSection
            userDetails={userDetails}
            onUpdateDetails={handleUpdateUserDetails}
            isLoading={isLoadingUserDetails}
          />
        );
      case "collection":
        return <CollectionSection onNavigate={onNavigate} />;
      case "orders":
        return <OrdersSection />;
      case "addresses":
        return <ManageAddressesSection />;
      case "payment-methods":
        return <PaymentMethodsSection />;
      default:
        return (
          <PersonalInfoSection
            userDetails={userDetails}
            onUpdateDetails={handleUpdateUserDetails}
            isLoading={isLoadingUserDetails}
          />
        );
    }
  };

  return (
    <AccountPageLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      avatarUrl={userDetails?.avatar_url}
      userName={userDetails?.first_name}
    >
      {renderActiveTabContent()}
    </AccountPageLayout>
  );
};
