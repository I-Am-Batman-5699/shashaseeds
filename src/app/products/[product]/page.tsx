"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import productsData from "../../../../public/models/products/products.json";

// Placeholder for Configuration
const config = {
    productDetailPage: {
        features: {
            showPrice: true,
            showDiscount: true,
            showRating: true,
            showTags: true,
            showStock: true,
        }
    }
};

// Simplified Featured Products placeholder
const featuredProductsData = [
    { id: 'feat1', name: 'Organic Basil Seeds', price: 9.99, images: ['/images/basil.jpg'], rating: 4.5, discount: 10 },
    { id: 'feat2', name: 'Heirloom Tomato Seeds', price: 12.50, images: ['/images/tomato.jpg'], rating: 3.8, discount: 0 },
    { id: 'feat3', name: 'Rainbow Carrot Mix', price: 7.99, images: ['/images/carrot.jpg'], rating: 4.2, discount: 20 },
];

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  // NOTE: Assuming `discount` is percentage (e.g., 10 for 10%)
  discount?: number; 
  available?: boolean;
  stock?: number; // Added stock to align with card logic
  images?: string[];
  description?: string;
  sku?: string;
  rating?: number;
  attributes?: Record<string, any>;
  tags?: string[];
};

// Skeleton Loader component (kept for good UX)
const ProductDetailSkeleton = () => (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="grid gap-6 md:grid-cols-[40%_60%] bg-white rounded-xl p-6 shadow-lg">
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="flex-1 h-96 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="h-5 w-1/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

// ⭐ REUSABLE STAR RATING COMPONENT (from ProductCard logic)
const StarRating = ({ rating }: { rating: number }) => {
    const floorRating = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    // Full Star SVG (filled)
    const FullStar = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
    );

    // Half Star SVG (uses the same full path but for half fill visualization)
    const HalfStar = () => (
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792V14.6564ZM11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
    );

    // Empty Star SVG
    const EmptyStar = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" opacity="0.3"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
    );

    return (
        <div className="flex items-center text-yellow-500">
            {Array.from({ length: floorRating }).map((_, index) => <FullStar key={`filled-${index}`} />)}
            {hasHalfStar && <HalfStar key="half" />}
            {Array.from({ length: emptyStars }).map((_, index) => <EmptyStar key={`empty-${index}`} />)}
        </div>
    );
};
// --- END: StarRating Component ---


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.product as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); 
  const [isInWishlist, setIsInWishlist] = useState(false);

  const totalImages = product?.images?.length ?? 0;
  const mainImageIndex = product?.images?.findIndex(img => img === mainImage) ?? -1;

  const navigateImage = (dir: "prev" | "next") => {
    if (!product || !product.images || totalImages <= 1) return;
    let nextIndex = mainImageIndex;
    if (dir === "next") {
      nextIndex = (mainImageIndex + 1) % totalImages;
    } else if (dir === "prev") {
      nextIndex = (mainImageIndex - 1 + totalImages) % totalImages;
    }
    setMainImage(product.images[nextIndex]);
  };

  const handleQuantityChange = useCallback((value: number | string) => {
    let newQty: number;
    if (typeof value === 'string') {
      newQty = parseInt(value) || 1;
    } else {
      newQty = value;
    }
    newQty = Math.max(1, newQty);
    setQuantity(newQty);
  }, []);

  // ⭐ ProductCard Logic for Availability (stock & available flags)
  const isAvailable = product && (product.available ?? true) && (product.stock ?? 1) > 0;

  const finalPrice = product ? (product.price * (1 - (product.discount ?? 0) / 100)).toFixed(2) : '0.00';
  const originalPrice = product ? product.price.toFixed(2) : '0.00';
  const discountPercentage = product?.discount ?? 0;
  const isDiscountAvailable = discountPercentage > 0;

  useEffect(() => {
    setLoading(true);
    const isCategory = ['herb-seeds', 'flower-seeds', 'vegetable-seeds', 'fruit-seeds', 'organic-collection'].includes(productId);

    if (isCategory) {
      window.location.href = `/products?category=${productId}`;
      return;
    }

    const found = productsData.products.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      if (found.images && found.images.length > 0) {
        setMainImage(found.images[0]);
      }
    }
    setLoading(false);
  }, [productId]);

  if (loading) return <div className="p-8"><ProductDetailSkeleton /></div>; 
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
      <a
        href="/products"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Browse All Products
      </a>
    </div>
  );

  // ⭐ Harmonized Button Handlers
  const handleAddToCart = () => {
    if (!isAvailable) return;
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const handleEnquiry = () => alert(`Enquiry initiated for ${product.name}`);
  const handleNotify = () => alert(`Will notify you when ${product.name} is back in stock.`);
  const handleWishlistToggle = () => setIsInWishlist(!isInWishlist);

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100">
      <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
        <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <a href="/products" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </a>

            <div className="grid gap-6 md:grid-cols-[40%_60%] inset-shadow-sm inset-shadow-indigo-200/50 space-y-1 md:p-4 lg:p-6 rounded-2xl shadow-xl">
              
              {/* LEFT COLUMN: Images & Action Buttons (40%) */}
              <div className="flex flex-col gap-4"> 
                
                {/* 1. Image Block: Main Image + Vertical Thumbnails (Desktop) */}
                <div className="flex gap-4 relative">
                    {/* Wishlist Button (Added based on Card logic) */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all z-10 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                            }`}
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                    </button>

                  {/* Vertical thumbnails (Desktop) */}
                  <div className="hidden md:flex flex-col items-center gap-2 h-full">
                    <button
                      onClick={() => navigateImage("prev")} 
                      disabled={totalImages <= 1}
                      className="w-6 h-6 sm:w-4 sm:h-4 md:w-8 md:h-8 bg-gray-400/30 hover:bg-gray-300/30 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-20 opacity-40 md:opacity-100 hover:opacity-100"
                    >
                      ▲
                    </button>
                    <div 
                        className="flex flex-col gap-2 overflow-y-auto max-h-96 scroll-smooth" 
                        style={{ height: 'calc(100% - 72px)' }} 
                    >
                      {(product.images ?? []).map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setMainImage(src)}
                          className={`w-16 h-16 p-1 rounded-lg border transition-all flex-shrink-0 ${mainImage === src
                            ? "ring-2 ring-green-500 border-green-500"
                            : "border-gray-200 hover:border-green-300"
                            }`}
                        >
                          <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover rounded" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => navigateImage("next")} 
                      disabled={totalImages <= 1}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Main image container with fixed aspect ratio */}
                  <div className="flex-1">
                      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"> 
                          {mainImage && (
                              <img
                                  src={mainImage}
                                  alt={product.name}
                                  className="absolute inset-0 w-full h-full object-contain p-4" // object-contain for seeds
                              />
                          )}
                          {!mainImage && (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-200">
                                  [Image Not Available]
                              </div>
                          )}
                      </div>
                  </div>
                </div>

                {/* 2. Horizontal thumbnails for Mobile */}
                <div className="flex md:hidden overflow-x-auto py-2 gap-2 scroll-smooth">
                    {(product.images ?? []).map((src, i) => (
                        <button
                          key={`mobile-${i}`}
                          onClick={() => setMainImage(src)}
                          className={`flex-shrink-0 w-16 h-16 p-1 rounded-lg border transition-all ${mainImage === src
                            ? "ring-2 ring-green-500 border-green-500"
                            : "border-gray-200 hover:border-green-300"
                            }`}
                        >
                          <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover rounded" />
                        </button>
                    ))}
                </div>
                
                {/* ⭐ 3. Action Block: Qty, Buttons (Price/Rating MOVED to Right) */}
                <div className="pt-4 space-y-4 border-t md:border-t-0 border-gray-200"> 
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-gray-700">Qty:</h3>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1 || !isAvailable}
                          className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          disabled={!isAvailable}
                          className="w-12 text-center border-x border-gray-300 p-2 focus:ring-green-500 focus:border-green-500 outline-none disabled:bg-gray-50"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={!isAvailable}
                          className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ⭐ Action Buttons (Harmonized with ProductCard) */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-2 rounded-md text-sm font-semibold transition-colors flex items-center justify-center
                                ${!isAvailable
                                    ? 'bg-blue-700 text-white hover:bg-blue-800' // Notify Me Style
                                    : 'bg-yellow-500 text-white hover:bg-yellow-600' // Add to Cart Style
                                }`}
                        >
                            {isAvailable ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-1" fill="currentColor"><path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-1" fill="currentColor"><path d="M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                            )}
                            {isAvailable ? `Add ${quantity} to Cart` : 'Notify Me'}
                        </button>
                        <button
                            onClick={handleEnquiry}
                            className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold text-gray-800 hover:text-gray-50 bg-green-100 hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-1" fill="currentColor"><path d="M17 2V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7V2H17ZM7 6H5V20H19V6H17V8H7V6ZM9 16V18H7V16H9ZM9 13V15H7V13H9ZM9 10V12H7V10H9ZM15 4H9V6H15V4Z"></path></svg>
                            General Product Enquiry
                        </button>
                    </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Product Info (60%) */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
                </div>
                
                {/* ⭐ MOVED: Price, Discount, Rating, Stock Status (Harmonized with Card logic) */}
                <div className="space-y-3">
                    {/* Ratings */}
                    {config.productDetailPage.features.showRating && product.rating && (
                        <div className="flex items-center space-x-2">
                            <StarRating rating={product.rating} />
                            <span className="text-gray-500 text-sm">({product.rating.toFixed(1)} Rating)</span>
                        </div>
                    )}

                    {/* Price and Discount */}
                    {config.productDetailPage.features.showPrice && (
                        <div className="flex items-baseline">
                            <p className="sm:text-lg md:text-xl lg:text-3xl font-bold text-green-700">
                                ₹{finalPrice}
                            </p>
                            {isDiscountAvailable && config.productDetailPage.features.showDiscount && (
                                <div className="flex items-center justify-center ml-4 space-x-2">
                                    <p className="text-lg text-gray-400 line-through">
                                        ₹{originalPrice}
                                    </p>
                                    <p className="text-lg text-red-600 font-medium">
                                        ({discountPercentage}% OFF)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Stock Status */}
                    {config.productDetailPage.features.showStock && (
                        <p className={`text-md font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </p>
                    )}
                </div>

                {product.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                )}

                {product.attributes && Object.keys(product.attributes).length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                          <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {config.productDetailPage.features.showTags && product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* --- NEW BOTTOM PANELS (Refined Review Panel) --- */}
            <div className="mt-8 space-y-10">
                
                {/* Panel 1: Reviews (Now uses the StarRating Component) */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
                    {product.rating ? (
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-4xl font-bold text-yellow-500">{product.rating.toFixed(1)}</span>
                            <div className="flex flex-col">
                                <StarRating rating={product.rating} />
                                <span className="text-sm text-gray-500">(Based on 55 Reviews)</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic mb-4">Be the first to leave a review!</p>
                    )}
                    
                    <p className="text-gray-600 italic">"The best seeds I've ever purchased! Highly recommend." - A Happy Gardener</p>
                    <button className="mt-4 text-green-600 hover:text-green-700 font-medium">Write a Review</button>
                </div>

                {/* Panel 2: Similar Products (Featured Products) */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Products</h2>
                    <p className="text-gray-600 mb-4">You might also like these featured items:</p>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                        {featuredProductsData.map((fp) => (
                            <a key={fp.id} href={`/products/${fp.id}`} className="flex-shrink-0 w-48 p-3 border rounded-lg hover:shadow-md transition-shadow duration-200">
                                <div className="relative w-full aspect-square mb-2 bg-gray-50 rounded overflow-hidden">
                                    <img 
                                        src={fp.images[0]} 
                                        alt={fp.name} 
                                        className="absolute inset-0 w-full h-full object-contain p-2" 
                                    />
                                </div>
                                <p className="font-medium text-sm text-gray-800 truncate">{fp.name}</p>
                                <div className="flex items-center space-x-1">
                                    <StarRating rating={fp.rating ?? 0} />
                                    <span className="text-gray-400 text-xs">({fp.rating?.toFixed(1)})</span>
                                </div>
                                <p className="text-green-600 font-bold text-md">
                                    ₹{fp.discount ? (fp.price * (1 - fp.discount / 100)).toFixed(2) : fp.price.toFixed(2)}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}