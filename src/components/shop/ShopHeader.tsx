// src/components/shop/ShopHeader.tsx
import React, { useState } from "react";
import { Shop } from "../../types"; // Adjust path
import { Star, Users, MessageCircle, Heart as HeartShopIcon } from "lucide-react";
import { followMainStore } from "../../services/shopApis"; // Adjust path

interface ShopHeaderProps {
  shop: Shop;
  onNavigate: (page: string, params?: any) => void;
}
export const ShopHeader: React.FC<ShopHeaderProps> = ({ shop, onNavigate }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentFollowers, setCurrentFollowers] = useState(shop.followersCount || 0);
  const handleFollowStore = async () => {
    try {
      const response = await followMainStore();
      if (response.success) {
        setIsFollowed(true);
        if (response.followersCount) setCurrentFollowers(response.followersCount);
      }
    } catch (error) {
      console.error("Failed to follow store", error);
    }
  };
  return (
    <div className="mb-8">
      <div className="h-48 md:h-64 bg-slate-200 rounded-lg overflow-hidden relative shadow-lg">
        <img
          src={shop.bannerUrl}
          alt={`${shop.name} banner`}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/1200x300/cccccc/757575?text=Shop+Banner")}
        />
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-xs">OUR STORE</div>
      </div>
      <div className="mt-[-40px] md:mt-[-50px] px-4 sm:px-6 relative z-10">
        <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden mt-[-20px] sm:mt-0">
            <img
              src={shop.avatarUrl}
              alt={`${shop.name} avatar`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/128x128/cccccc/757575?text=Shop+Avatar")}
            />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{shop.name}</h1>
            <div className="flex items-center justify-center sm:justify-start text-sm text-slate-600 mt-1">
              <Star size={16} className="text-orange-400 fill-orange-400 mr-1" />
              <span>
                {shop.rating.toFixed(1)} ({shop.reviewCount} ratings)
              </span>
              {currentFollowers > 0 && (
                <>
                  <span className="mx-2">|</span>
                  <Users size={16} className="mr-1 text-slate-500" />
                  <span>{currentFollowers.toLocaleString()} Followers</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Established: {new Date(shop.dateJoined).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
            <button
              onClick={handleFollowStore}
              disabled={isFollowed}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${
                isFollowed ? "bg-pink-100 text-pink-700 border-pink-300 cursor-not-allowed" : "bg-white text-pink-700 border-pink-500 hover:bg-pink-50"
              }`}
            >
              <HeartShopIcon size={16} className="mr-1.5" />
              {isFollowed ? "Following" : "Follow Us"}
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap"
            >
              <MessageCircle size={16} className="mr-1.5" /> Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
