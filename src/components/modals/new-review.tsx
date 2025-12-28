"use client";
import { Product, ReviewData } from "@/types/products/products";
import { useState } from "react";


const ReviewModal = ({ isOpen, onClose, productDetails, reviews }: { isOpen: boolean, onClose: () => void, productDetails: Product, reviews: ReviewData[] }) => {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewContent, setReviewContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewRating === 0 || !reviewTitle || !reviewContent) {
            console.error("Please fill all review fields.");
            return;
        }

        reviews.push({
            id: (reviews.length + 1).toString(),
            user: "Anonymous",
            rating: reviewRating,
            date: new Date().toISOString().split('T')[0],
            title: reviewTitle,
            content: reviewContent
        });

        setReviewRating(0);
        setReviewTitle('');
        setReviewContent('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-800/10 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all scale-100 duration-300 border border-reverse-theme"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <p className="sm:text:md md:text-xl font-semibold text-zinc-900 dark:text-zinc-100">Write a Review for {productDetails.name}</p>
                    <button onClick={onClose} className="text-cyan-400 hover:text-gray-600 transition-colors p-1 rounded-full bg-transparent dark:bg-gray-600/50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Input */}
                    <div>
                        <label className="block md:text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating:</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className={`p-2 transition-colors rounded-full ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                                >
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                                </button>
                            ))}
                        </div>
                        {reviewRating > 0 && <p className="mt-1 text-sm text-gray-500">You rated this {reviewRating} out of 5 stars.</p>}
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="review-title" className="block md:text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300">Review Title</label>
                        <input
                            id="review-title"
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            required
                            placeholder="Summarize your experience"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border text-zinc-950 dark:text-green-50"
                        />
                    </div>

                    {/* Content Input */}
                    <div>
                        <label htmlFor="review-content" className="block md:text-sm lg:text-md font-medium text-gray-700 dark:text-gray-300">Your Detailed Review</label>
                        <textarea
                            id="review-content"
                            rows={4}
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            required
                            placeholder="What did you like or dislike?"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border text-zinc-950 dark:text-green-50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl sm:text-md md:text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;