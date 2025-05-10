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

export const AccountPage: React.FC<AccountPageProps> = ({ initialTab = "personal-info", onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AccountTabId>(initialTab);
  const [userDetails, setUserDetails] = useState<UserAccountDetails | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!userDetails) {
      setIsLoadingUserDetails(true);
      getUserAccountDetails()
        .then(setUserDetails)
        .catch((err: Error) => console.error("Failed to load user details", err))
        .finally(() => setIsLoadingUserDetails(false));
    }
  }, [userDetails]);

  const handleUpdateUserDetails = async (details: Partial<UserAccountDetails>) => {
    try {
      const response = await updateUserAccountDetails(details);
      if (response.success && response.updatedDetails) {
        setUserDetails(response.updatedDetails);
        return { success: true, updatedDetails: response.updatedDetails };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating user details", error);
      return { success: false };
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfoSection userDetails={userDetails} onUpdateDetails={handleUpdateUserDetails} isLoading={isLoadingUserDetails} />;
      case "collection":
        return <CollectionSection onNavigate={onNavigate} />;
      case "orders":
        return <OrdersSection />;
      case "addresses":
        return <ManageAddressesSection />;
      case "payment-methods":
        return <PaymentMethodsSection />;
      default:
        return <PersonalInfoSection userDetails={userDetails} onUpdateDetails={handleUpdateUserDetails} isLoading={isLoadingUserDetails} />;
    }
  };

  return (
    <AccountPageLayout activeTab={activeTab} onTabChange={setActiveTab} avatarUrl={userDetails?.avatarUrl} userName={userDetails?.firstName}>
      {renderActiveTabContent()}
    </AccountPageLayout>
  );
};
