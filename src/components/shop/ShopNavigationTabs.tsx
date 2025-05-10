// --- src/components/shop/ShopNavigationTabs.tsx ---
import React from "react"; // Already imported
import { Search as SearchIconShopNav } from "lucide-react";

type ShopTab = "products" | "about" | "policies";
interface ShopNavigationTabsProps {
  activeTab: ShopTab;
  onTabChange: (tab: ShopTab) => void;
  onSearch?: (searchTerm: string) => void;
  shopName: string;
}
export const ShopNavigationTabs: React.FC<ShopNavigationTabsProps> = ({ activeTab, onTabChange, onSearch, shopName }) => {
  const tabs: { name: string; id: ShopTab }[] = [
    { name: "Our Products", id: "products" },
    { name: "About Our Store", id: "about" },
    { name: "Store Policies", id: "policies" },
  ];
  const [shopSearchTerm, setShopSearchTerm] = React.useState("");
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(shopSearchTerm);
  };
  return (
    <div className="border-b border-slate-200 bg-white rounded-t-lg shadow-sm sticky top-16 md:top-[140px] z-30">
      {" "}
      {/* Adjust top based on navbar height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label={`Navigation for ${shopName}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ? "border-green-600 text-green-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
          {onSearch && activeTab === "products" && (
            <form onSubmit={handleSearchSubmit} className="relative mt-3 md:mt-0 md:ml-4 w-full md:w-auto md:max-w-xs">
              <input
                type="search"
                value={shopSearchTerm}
                onChange={(e) => setShopSearchTerm(e.target.value)}
                placeholder={`Search in ${shopName}...`}
                className="w-full bg-slate-50 border border-slate-300 placeholder-slate-400 text-slate-700 rounded-md py-2 px-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIconShopNav size={16} className="text-slate-400" />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
