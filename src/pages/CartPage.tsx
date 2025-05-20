// src/pages/CartPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Cart } from "../types";
import { getSupabaseCart } from "../services/cartCheckoutApis";
import { updateSupabaseCartItemQuantity } from "../services/cartCheckoutApis";
import { removeSupabaseCartItem } from "../services/cartCheckoutApis";
// import { applyDiscountCode } from "../services/cartCheckoutApis";
import { CartItemCard } from "../components/cart/CartItemCard";
import { ShoppingBag, ChevronRight } from "lucide-react";

interface CartPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cartData = await getSupabaseCart();
      setCart(cartData);
    } catch (err: any) {
      setError(err.message || "Failed to load cart.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleUpdateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
    const itemId = `${productId}_${size || "any"}_${color || "any"}`;
    setUpdatingItemId(itemId);
    try {
      const updatedCart = await updateSupabaseCartItemQuantity(productId, quantity, size, color);
      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to update quantity", err);
    } finally {
      setUpdatingItemId(null);
    }
  };
  const handleRemoveItem = async (productId: string, size?: string, color?: string) => {
    const itemId = `${productId}_${size || "any"}_${color || "any"}`;
    setUpdatingItemId(itemId);
    try {
      const updatedCart = await removeSupabaseCartItem(productId, size, color);
      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to remove item", err);
    } finally {
      setUpdatingItemId(null);
    }
  };
  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;
    setIsApplyingDiscount(true);
    setDiscountError("");
    try {
      // const updatedCart = await applyDiscountCode(discountCode);
      // setCart(updatedCart);
      setDiscountCode("");
    } catch (err: any) {
      setDiscountError(err.message || "Failed to apply discount.");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50">
        <p>Loading your cart...</p>
      </div>
    );
  if (error) return <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50 p-4 text-red-600">Error: {error}</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <ShoppingBag size={64} className="text-slate-300 mb-6" />
        <h1 className="text-2xl font-semibold text-slate-700 mb-3">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => onNavigate?.("products")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }
  return (
    <div className="bg-stone-50 py-8 min-h-[calc(100vh-200px)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center sm:text-left">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 bg-white p-0 sm:p-6 rounded-lg shadow-md border border-slate-200">
            {cart.items.map((item) => (
              <CartItemCard
                key={`${item.productId}-${item.size}-${item.color}`}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                isUpdating={updatingItemId === `${item.productId}_${item.size || "any"}_${item.color || "any"}`}
              />
            ))}
          </div>
          <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-slate-200 sticky top-24">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal ({cart.items.length} items):</span>
                <span className="font-medium text-slate-700">${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({cart.discount.code}):</span>
                  <span>-${cart.discount.amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping:</span>
                <span className="font-medium text-slate-700">
                  {cart.shippingCost !== undefined ? `$${cart.shippingCost.toFixed(2)}` : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Taxes:</span>
                <span className="font-medium text-slate-700">{cart.taxes !== undefined ? `$${cart.taxes.toFixed(2)}` : "Calculated at checkout"}</span>
              </div>
            </div>
            <form onSubmit={handleApplyDiscount} className="mb-4 flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code"
                className="flex-grow p-2.5 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                disabled={isApplyingDiscount}
                className="bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-70"
              >
                {isApplyingDiscount ? "Applying..." : "Apply"}
              </button>
            </form>
            {discountError && <p className="text-xs text-red-500 mb-3">{discountError}</p>}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-slate-800">
                <span>Total:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.("checkout")}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
            >
              Proceed to Checkout <ChevronRight size={20} className="ml-2" />
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};
