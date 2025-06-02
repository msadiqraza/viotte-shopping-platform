// This document contains components for Account, Cart, and Checkout sections.
// Assumes types, services, and some shared components are available.

import React from "react";
import {
  UserCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  Heart
} from "lucide-react";

// --- src/components/account/AccountPageLayout.tsx ---
export type AccountTabId = "personal-info" | "collection" | "orders" | "addresses" | "payment-methods";
interface AccountPageLayoutProps {
  activeTab: AccountTabId;
  onTabChange: (tabId: AccountTabId) => void;
  children: React.ReactNode;
}
const accountTabsList: { id: AccountTabId; label: string; icon: React.ElementType }[] = [
  { id: "personal-info", label: "Personal Information", icon: UserCircle },
  { id: "collection", label: "Collection", icon: Heart },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "addresses", label: "Manage Addresses", icon: MapPin },
  { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
];
export const AccountPageLayout: React.FC<AccountPageLayoutProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <div className="bg-stone-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-300 bg-white shadow-sm rounded-t-lg">
          <nav className="-mb-px flex space-x-1 sm:space-x-3 overflow-x-auto px-4" aria-label="Account navigation">
            {accountTabsList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group inline-flex items-center py-3.5 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out ${
                  activeTab === tab.id ? "border-green-600 text-green-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon
                  className={`mr-1.5 sm:mr-2 h-5 w-5 ${activeTab === tab.id ? "text-green-600" : "text-slate-400 group-hover:text-slate-500"}`}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
};
