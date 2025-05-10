// --- src/components/product/SellerPolicies.tsx ---
// (This is for product-specific policies if they exist, distinct from main store policies)
import React from "react"; // Already imported
import { Product } from '../../types'; // Already imported

interface SellerPoliciesProps {
  policies?: Product["policies"];
}
export const SellerPolicies: React.FC<SellerPoliciesProps> = ({ policies }) => {
  if (!policies || (!policies.shipping && !policies.returns && !policies.payment)) {
    // If no product-specific policies, don't render this section.
    // Main store policies are shown on the ShopPage.
    return null;
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Product Policies</h2>
      <div className="space-y-3 text-sm text-slate-600">
        {policies.shipping && (
          <div>
            <h3 className="font-medium text-slate-700">Shipping:</h3>
            <p className="whitespace-pre-line">{policies.shipping}</p>
          </div>
        )}
        {policies.returns && (
          <div>
            <h3 className="font-medium text-slate-700">Returns:</h3>
            <p className="whitespace-pre-line">{policies.returns}</p>
          </div>
        )}
        {policies.payment && (
          <div>
            <h3 className="font-medium text-slate-700">Payment:</h3>
            <p className="whitespace-pre-line">{policies.payment}</p>
          </div>
        )}
      </div>
    </div>
  );
};
