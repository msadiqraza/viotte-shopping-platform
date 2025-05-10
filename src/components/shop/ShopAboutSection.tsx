// --- src/components/shop/ShopAboutSection.tsx ---
import React from "react"; // Already imported
interface ShopAboutSectionProps {
  description: string;
  shopName: string;
}
export const ShopAboutSection: React.FC<ShopAboutSectionProps> = ({ description, shopName }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-6 border border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">About {shopName}</h2>
      <div
        className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description || "<p>No description provided by the store.</p>" }}
      ></div>
    </div>
  );
};
