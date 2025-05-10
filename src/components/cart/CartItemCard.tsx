// --- src/components/cart/CartItemCard.tsx ---
import { Minus, Plus } from "lucide-react";
import { CartItemCardProps } from "../../types";

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) onUpdateQuantity(item.productId, newQuantity, item.size, item.color);
  };
  return (
    <div className={`flex items-start sm:items-center gap-4 p-4 border-b border-slate-200 ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}>
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border border-slate-200"
        onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100/e0e0e0/757575?text=No+Image")}
      />
      <div className="flex-grow">
        <h3 className="text-sm sm:text-md font-semibold text-slate-800 hover:text-green-700">
          <a href={`/product/${item.productId}`}>{item.name}</a>
        </h3>
        {(item.size || item.color) && (
          <p className="text-xs text-slate-500 mt-0.5">
            {item.size && `Size: ${item.size}`}
            {item.size && item.color && `, `}
            {item.color && `Color: ${item.color}`}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-0.5">Price: ${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2 space-x-2">
          <label htmlFor={`quantity-${item.productId}`} className="text-xs text-slate-600 sr-only">
            Quantity:
          </label>
          <div className="flex items-center border border-slate-300 rounded-md h-8">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="px-2 text-slate-600 hover:bg-slate-100 rounded-l-md disabled:opacity-50 h-full"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              id={`quantity-${item.productId}`}
              value={item.quantity}
              readOnly
              className="w-10 text-center border-y-0 border-x text-sm focus:ring-0 focus:border-slate-300 h-full p-0"
            />
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="px-2 text-slate-600 hover:bg-slate-100 rounded-r-md disabled:opacity-50 h-full"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full ml-auto pl-2">
        <p className="text-md font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemoveItem(item.productId, item.size, item.color)}
          className="text-xs text-red-500 hover:text-red-700 hover:underline mt-2 sm:mt-0 disabled:opacity-50"
          disabled={isUpdating}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
