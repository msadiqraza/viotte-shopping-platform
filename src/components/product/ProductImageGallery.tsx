// src/components/product/ProductImageGallery.tsx
import React, { useState } from "react";

interface ProductImageGalleryProps {
  mainImageUrl: string;
  thumbnailUrls?: string[];
  productName: string;
}
export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ mainImageUrl, thumbnailUrls, productName }) => {
  const [currentImage, setCurrentImage] = useState(mainImageUrl);
  const allImages = [mainImageUrl, ...(thumbnailUrls || [])].filter(Boolean);
  const handleThumbnailClick = (url: string) => setCurrentImage(url);
  if (!currentImage)
    return <div className="w-full aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">No Image Available</div>;
  return (
    <div className="w-full">
      <div className="mb-4 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <img
          src={currentImage}
          alt={`Main image of ${productName}`}
          className="w-full h-auto aspect-square object-cover transition-opacity duration-300"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x600/e0e0e0/757575?text=Image+Error")}
        />
      </div>
      {allImages && allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((url, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(url)}
              className={`border rounded-md overflow-hidden aspect-square focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                currentImage === url ? "ring-2 ring-orange-500 shadow-md" : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={url}
                alt={`Thumbnail ${index + 1} of ${productName}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100/e0e0e0/757575?text=Thumb+Err")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
