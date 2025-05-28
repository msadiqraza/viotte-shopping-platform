// src/components/shared/ProductCard.tsx
import React from "react";
import { Product } from "../../types"; // Adjust path: e.g., ../../types
import { Star, ShoppingCart as CartIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) stars.push(<Star key={`full-${i}`} size={16} className="text-orange-400 fill-orange-400" />);
    for (let i = stars.length; i < 5; i++) stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    return stars;
  };
  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate("product", { id: product.id });
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl h-full">
      <a href={`/product/${product.id}`} onClick={handleProductClick} className="block overflow-hidden aspect-[4/3] relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300/e0e0e0/757575?text=No+Image")}
        />
      </a>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-slate-800 mb-1 truncate group-hover:text-green-700 transition-colors">
          <a href={`/product/${product.id}`} onClick={handleProductClick}>
            {product.name}
          </a>
        </h3>
        <div className="flex items-center my-1">
          {renderStars(product.rating)}
          <span className="ml-2 text-xs text-slate-500">({product.rating.toFixed(1)})</span>
        </div>
        <p className="text-lg font-bold text-slate-700 mb-2">${product.price.toFixed(2)}</p>
        <button
          className="mt-auto w-full bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
          onClick={() => console.log("Add to cart:", product.id)}
        >
          <CartIcon size={18} className="mr-2" /> Add to Cart
        </button>
      </div>
    </div>
  );
};
