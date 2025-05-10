// --- src/components/product/CustomerReviews.tsx ---
import React, { useState } from "react"; // Already imported
import { Review } from "../../types"; // Adjust path
import { Star as StarIconRev } from "lucide-react";

interface CustomerReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div className="py-4 border-b border-slate-200 last:border-b-0">
    <div className="flex items-center mb-1">
      {review.reviewerAvatar ? (
        <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-8 h-8 rounded-full mr-2 object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-300 mr-2 flex items-center justify-center text-slate-600 text-sm">{review.reviewerName.charAt(0)}</div>
      )}
      <span className="font-semibold text-sm text-slate-700">{review.reviewerName}</span>
      {review.verifiedPurchase && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Verified Purchase</span>}
    </div>
    <div className="flex items-center mb-1">
      {[...Array(5)].map((_, i) => (
        <StarIconRev key={i} size={16} className={i < review.rating ? "text-orange-400 fill-orange-400" : "text-slate-300"} />
      ))}
      <span className="ml-2 text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</span>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
  </div>
);
export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, averageRating, totalReviews }) => {
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);
  if (!reviews || reviews.length === 0)
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Customer Reviews</h2>
        <p className="text-sm text-slate-500">No reviews yet for this product.</p>
      </div>
    );
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-1">Customer Reviews</h2>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIconRev key={i} size={20} className={i < Math.round(averageRating) ? "text-orange-400 fill-orange-400" : "text-slate-300"} />
          ))}
        </div>
        <span className="ml-2 text-lg font-semibold text-slate-700">{averageRating.toFixed(1)}/5.0</span>
        <span className="ml-2 text-sm text-slate-500">({totalReviews} Ratings)</span>
      </div>
      <div className="space-y-2">
        {reviewsToShow.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
      {reviews.length > 3 && (
        <button onClick={() => setShowAll(!showAll)} className="mt-4 text-sm text-green-600 hover:underline">
          {showAll ? "Show Less Reviews" : "Show More Reviews"}
        </button>
      )}
    </div>
  );
};
