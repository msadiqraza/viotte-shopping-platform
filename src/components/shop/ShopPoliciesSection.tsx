// --- src/components/shop/ShopPoliciesSection.tsx ---
import React from "react"; // Already imported

interface ShopPoliciesSectionProps {
  policies: {
    shipping: string;
    returns: string;
    payment: string;
  };
}
export const ShopPoliciesSection: React.FC<ShopPoliciesSectionProps> = ({ policies }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-6 border border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Store Policies</h2>
      <div className="space-y-6">
        {policies.shipping && (
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">Shipping</h3>
            <p className="text-sm text-slate-600 whitespace-pre-line">{policies.shipping}</p>
          </div>
        )}
        {policies.returns && (
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">Returns & Exchanges</h3>
            <p className="text-sm text-slate-600 whitespace-pre-line">{policies.returns}</p>
          </div>
        )}
        {policies.payment && (
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">Payment Options</h3>
            <p className="text-sm text-slate-600 whitespace-pre-line">{policies.payment}</p>
          </div>
        )}
        {!policies.shipping && !policies.returns && !policies.payment && <p className="text-sm text-slate-500">No specific policies provided by the store.</p>}
      </div>
    </div>
  );
};
