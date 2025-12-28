"use client";
import { ReviewData } from "@/types/products/products";
import StarRating from "./StarRating";

const ReviewItem = ({ review }: { review: ReviewData }) => {
  return (
    <div>
      <div className="border-t border-gray-200 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="sm:flex-col md:flex items-start">
            <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{review.title}</p>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{review.content}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-end">— {review.user}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;