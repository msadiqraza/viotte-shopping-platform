// --- src/components/product/ProductInfo.tsx ---
import React, { useState, useEffect } from "react"; // Already imported
import { Product, NavigateParams } from "../../types"; // Adjust path
import {
  Star,
  Minus,
  Plus,
  Heart as HeartIcon,
  ShoppingCart as CartIconProdInfo,
} from "lucide-react"; // Aliased CartIcon

interface ProductInfoProps {
  product: Product;
  onAddToCart: (
    productId: string,
    quantity: number,
    price: number,
    name?: string,
    imageUrl?: string,
    size?: string,
    color?: string
  ) => void;
  // onBuyNow: (productId: string, quantity: number) => void;
  onWishlist: (productId: string) => Promise<boolean>;
  onNavigate: (page: string, params?: NavigateParams) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  // onBuyNow,
  onWishlist,
  onNavigate,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]?.name);
  const [added, setAdded] = useState(
    window.localStorage.getItem(`wishlist-added-${product.id}`) === "true" || false
  );
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(`wishlist-added-${product.id}`, added.toString());
  }, [added]);

  const handleClick = async () => {
    const success = await onWishlist(product.id);
    if (success) {
      setAdded(true);
    }
  };

  const handleQuantityChange = (amount: number) =>
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, product.stock || 99)));
  const handleVisitStore = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate("shop");
  }; // Navigates to the single main store

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
      {product.seller && (
        <a href="#" onClick={handleVisitStore} className="text-sm text-green-600 hover:underline">
          Visit {product.seller.name}
        </a>
      )}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(product.rating)
                  ? "text-orange-400 fill-orange-400"
                  : "text-slate-300"
              }
            />
          ))}
        </div>
        <span className="text-sm text-slate-600">
          {product.rating.toFixed(1)}/5.0 ({product.reviewCount || 0} Ratings)
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-800">${product.price.toFixed(2)}</p>
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Size:</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-1.5 border rounded-md text-sm transition-colors ${
                  selectedSize === size
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-slate-700 border-slate-300 hover:border-green-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Color:</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                  selectedColor === color.name
                    ? "ring-2 ring-offset-1 ring-green-700"
                    : "hover:opacity-80"
                }`}
                style={{
                  backgroundColor: color.hex,
                  borderColor: selectedColor === color.name ? color.hex : "#d1d5db",
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity:</label>
        <div className="flex items-center border border-slate-300 rounded-md w-fit">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-l-md disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-12 text-center border-none focus:ring-0 text-sm"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-r-md disabled:opacity-50"
            disabled={quantity >= (product.stock || 99)}
          >
            <Plus size={16} />
          </button>
        </div>
        {product.stock !== undefined && (
          <p className="text-xs text-slate-500 mt-1">
            {product.stock > 0 ? `${product.stock} items in stock` : "Out of stock"}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => {
            onAddToCart(
              product.id,
              quantity,
              product.price,
              product.name,
              product.imageUrl,
              selectedSize,
              selectedColor
            );
            setIsAddedToCart(true);
          }}
          className="flex-1 max-w-[200px] bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-sm"
          disabled={product.stock === 0}
        >
          <CartIconProdInfo size={18} className="mr-2" />{" "}
          {isAddedToCart ? "Added" : "Add to Cart"}
        </button>
        {/* <button
          onClick={() => onBuyNow(product.id, quantity)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors text-sm"
          disabled={product.stock === 0}
        >
          Buy Now
        </button> */}
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <button
          onClick={handleClick}
          className="text-sm text-slate-600 hover:text-orange-500 flex items-center relative"
        >
          <HeartIcon
            size={16}
            className="mr-1.5 transition-all duration-300"
            fill={added ? "red" : "none"}
            stroke={added ? "red" : "currentColor"}
          />
          {added ? (
            <span className="text-red-700">Added to Collection</span>
          ) : (
            <span>Add to Collection</span>
          )}
        </button>
      </div>
    </div>
  );
};
