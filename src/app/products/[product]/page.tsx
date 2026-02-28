"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import productsCSS from '@/styles/products.module.css';
import { FeaturedProductsProps, Product, ReviewData, Reviews, ProductsData, ProductProps, FeaturedProduct } from "@/types/products/products";
import { Features, FeatureToggleProps, ActionButton } from "@/types/featureToggle";
import StarRating from "@/components/common/StarRating";
import ReviewItem from "@/components/common/ReviewItem";
import ReviewModal from "@/components/modals/new-review";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import LucideIconCustom from "@/components/ui/lucideIcons";
import { FetchItems } from "@/lib/fetcher";
import Link from "next/link";

const defaultConfig = {
  features: {
    showPrice: true,
    showDiscount: true,
    showRating: true,
    showTags: true,
    showStock: true,
    showNewBadge: true,
    showSaleBadge: true,
    showFeaturedBadge: true
  },
  actionsButtons: {
    enableAddToCart: true,
    enableWishlist: true,
    enableEnquire: true,
    enableCompare: false,
    enableReview: true,
    showFeaturedBadge: true,
    showAddToCartButton: true,
    showWishlistButton: true,
    showEnquireButton: true,
    showReview: true
  }

};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.product as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [config, setConfig] = useState<Features | typeof defaultConfig.features>(defaultConfig.features);
  const [actionButtonConfig, setActionButtonConfig] = useState<ActionButton | typeof defaultConfig.actionsButtons>(defaultConfig.actionsButtons);
  const [productDetails, setProductDetails] = useState<ProductsData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const horizontalThumbsRef = useRef<HTMLDivElement>(null);

  const totalImages = product?.images?.length ?? 0;
  const mainImageIndex = product?.images?.findIndex(img => img === mainImage) ?? -1;

  const syncScrollToImage = useCallback((index: number) => {
    if (horizontalThumbsRef.current) {
      const container = horizontalThumbsRef.current;
      const thumbnail = container.children[index] as HTMLElement;

      if (thumbnail) {
        const scrollPosition = thumbnail.offsetLeft - (container.offsetWidth / 2) + (thumbnail.offsetWidth / 2);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, []);


  const navigateImage = (dir: "prev" | "next") => {
    if (!product || !product.images || totalImages <= 1) return;
    let nextIndex = mainImageIndex;
    if (dir === "next") {
      nextIndex = (mainImageIndex + 1) % totalImages;
    } else if (dir === "prev") {
      nextIndex = (mainImageIndex - 1 + totalImages) % totalImages;
    }
    const newImage = product.images[nextIndex];
    setMainImage(newImage);
    syncScrollToImage(nextIndex);
  };

  const handleThumbnailClick = (src: string, index: number) => {
    setMainImage(src);
    syncScrollToImage(index);
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

  useEffect(() => {

    setLoading(true);

    const loadData = async () => {
      try {
        setLoading(true);

        const [
          productsRes,
          featuredRes,
          featureToggleRes,
          reviewsRes
        ] = await Promise.all([
          FetchItems({ path: "/models/products/products.json" }),
          FetchItems({ path: "/models/products/featured-products.json" }),
          FetchItems({ path: "/models/feature/feature-toggle.json" }),
          FetchItems({ path: "/models/products/products-reviews.json" }),
        ]);

        const products = productsRes.data as ProductProps;
        const featuredData = featuredRes.data as FeaturedProductsProps;
        const featureConfig = featureToggleRes.data as FeatureToggleProps;
        const reviewsJson = reviewsRes.data as Reviews;

        const found = products?.products?.find((p: Product) => p.id === productId);

        if (!found) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(found);
        setMainImage(found.images?.[0] || null);

        setProductDetails({
          isAvailable: (found.available ?? true) && (found.stock ?? 1) > 0,
          finalPrice: (found.price * (1 - (found.discountPercentage ?? 0) / 100)).toFixed(2),
          originalPrice: found.price.toFixed(2),
          discountPercentage: found.discountPercentage ?? 0,
          isDiscountAvailable: (found.discountPercentage ?? 0) > 0,
        });

        const featured = (featuredData as FeaturedProductsProps)?.products.reduce<Product[]>((acc: Product[], el: FeaturedProduct) => {
          const prod = products.products.find((p: Product) => p.id === el["product-id"]);
          if (prod) acc.push({ ...el, ...prod });
          return acc;
        }, []);

        setFeaturedProducts(featured as Product[]);
        setConfig(featureConfig["products-page"].features);
        setActionButtonConfig(featureConfig["products-page"].actionButtons);
        setReviews(reviewsJson?.customerReviews?.[productId] || []);

      } catch (err) {
        console.error("Error loading product page:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadData();
    }

  }, [productId]);

  // TODO: get that dd to cart fetaure
  const handleAddToCart = () => {
    if (!productDetails?.isAvailable) return;
    alert(`Added ${quantity} x ${product!.name} to cart! (Check console)`);
  };

  // TODO: add the content to mailing section 
  const handleEnquiry = () => {
    console.log(`Enquiry initiated for ${product!.name}`);
    alert(`Enquiry initiated for ${product!.name}`);
  };

  // TODO: implement wishlist feature
  const handleWishlistToggle = () => setIsInWishlist(!isInWishlist);

  const ActionBlock = ({ isMobile }: { isMobile: boolean }) => (
    <div className={`pt-4 space-y-4 ${isMobile ? 'border-t border-gray-200' : ''}`}>

      {/* Quantity Selector */}
      {actionButtonConfig.showAddToCartButton && (
        <div className="flex items-center space-x-4">
          <p className="font-medium text-zinc-700 dark:text-green-50">Qty:</p>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity < 1 || !productDetails?.isAvailable}
              className="p-3 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-green-100 hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              disabled={!productDetails?.isAvailable}
              className="w-12 text-center border-x border-gray-300 p-2 focus:ring-green-500 focus:border-green-500 outline-none disabled:bg-gray-50 text-sm text-zinc-900 dark:text-green-50"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={!productDetails?.isAvailable}
              className="p-3 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-green-100 hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons (Add to Cart/Notify, Enquiry) */}
      <div className="space-y-3">
        {actionButtonConfig.showAddToCartButton && (
          <button
            onClick={!actionButtonConfig.enableAddToCart ? () => { } : handleAddToCart}
            disabled={!productDetails?.isAvailable}
            className={`w-full py-3 rounded-xl sm:text-sm md:text-md lg:text-md font-bold transition-colors shadow-lg
              ${!actionButtonConfig.enableAddToCart ? "opacity-40 cursor-not-allowed" : ""}
                    ${!productDetails?.isAvailable
                ? 'bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-70'
                : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600 dark:bg-orange-500 dark:text-green-50 dark:hover:bg-orange-600 disabled:opacity-70'
              }`}
          >
            {productDetails?.isAvailable ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 inline-block mr-2" fill="currentColor"><path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z" /></svg>
                Add {quantity} to Cart
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 inline-block mr-2" fill="currentColor"><path d="M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z" /></svg>
                Notify Me When Back in Stock
              </>
            )}
          </button>
        )}
        <button
          onClick={!actionButtonConfig.enableEnquire ? () => { } : handleEnquiry}
          className={`w-full border border-gray-300 rounded-xl sm:text-sm md:text-md lg:text-md py-3 text-sm font-semibold text-primary-text  hover:text-white dark:hover:text-white bg-accent hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-lg ${!actionButtonConfig.enableEnquire ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 inline-block mr-1" fill="currentColor"><path d="M17 2V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7V2H17ZM7 6H5V20H19V6H17V8H7V6ZM15 4H9V6H15V4Z" /></svg>
          General Product Enquiry
        </button>
      </div>
    </div>
  );


  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 min-h-screen">
      <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
        <div className="rounded-2xl shadow-xl space-y-1 inset-shadow-sm dark:inset-shadow-indigo-900/50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className={productsCSS.customButtom}>
              <Link href="/products" className="inline-flex items-center text-accent font-medium hover:text-green-700 mb-6 transition-colors">
                <LucideIconCustom
                  name="chevronLeft"
                  className="w-5 h-5 font-semibold"
                />
                Back to Products
              </Link>
            </div>
            {
              loading || !product ? (
                loading ? <HelixHorizontal /> :
                  < div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 min-h-[40vh]">
                    <div className="mx-auto max-w-[90%] py-12 flex flex-col items-center justify-center text-center">
                      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl space-y-6 max-w-lg border border-green-100 dark:border-slate-800">
                        <div className="flex justify-center">
                          {/* Large Icon matching your style */}
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <LucideIconCustom name="messageCircleX" className="w-18 h-18 text-red-500" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-green-50">
                            Product Not Found
                          </h1>
                          <p className="text-zinc-600 dark:text-zinc-400">
                            We couldn&apos;t find the product <span className="font-mono text-accent">&quot;{productId}&quot;</span>.
                            It might have been removed or the link is incorrect.
                          </p>
                        </div>

                        <div className={productsCSS.customButtom}>
                          <Link
                            href="/products"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-accent hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20"
                          >
                            Browse All Products
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
              )
                :
                <div>
                  {/* ⭐ MAIN GRID CONTAINER: Left 40% (Image + Desktop Actions) | Right 60% (Info + Mobile Actions) */}
                  <div className="flex flex-col gap-6 md:grid md:grid-cols-[40%_60%] bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 p-4 lg:p-6 rounded-2xl shadow-2xl inset-shadow-sm dark:inset-shadow-indigo-900/50">

                    {/* 1. LEFT COLUMN: Image Gallery + Desktop Actions (40%) */}
                    <div className="flex flex-col gap-4">

                      {/* Image Gallery (Main Image + Vertical Thumbs) */}
                      <div className="flex gap-4 relative md:h-96 lg:h-[32rem]">
                        {/* Wishlist Button */}
                        {
                          actionButtonConfig.showWishlistButton && (
                            <button
                              onClick={handleWishlistToggle}
                              className={`absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-zinc-700 bg-opacity-80 hover:bg-opacity-100 transition-all z-10 shadow-lg 
                       ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
                       ${!actionButtonConfig.enableWishlist ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            </button>
                          )
                        }

                        {/* Vertical thumbnails (Desktop) */}
                        <div className="hidden md:flex flex-col items-center gap-2 h-full">
                          <button
                            onClick={() => navigateImage("prev")}
                            disabled={totalImages <= 1}
                            className="md:w-8 md:h-8 bg-green-200 dark:bg-zinc-600 hover:bg-green-300 dark:hover:bg-zinc-800 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                          </button>
                          <div className="flex flex-col gap-2 overflow-y-auto scroll-smooth flex-1">
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
                            className="md:w-8 md:h-8 bg-green-200 dark:bg-zinc-600 hover:bg-green-300 dark:hover:bg-zinc-800 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>

                        {/* Main image container */}
                        <div className="flex-1">
                          <div className="relative w-full aspect-square md:h-full md:aspect-auto bg-green-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg inset-shadow-sm">
                            {mainImage && (
                              <img
                                src={mainImage}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x800/AAAAAA/FFFFFF?text=Failed+To+Load')}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Horizontal thumbnails for Mobile (Goal 3 & 4) */}
                      <div className="flex md:hidden items-center">
                        <button
                          onClick={() => navigateImage("prev")}
                          disabled={totalImages <= 1}
                          className="p-2 mr-2 bg-green-200 dark:bg-zinc-600 hover:bg-green-300 dark:hover:bg-zinc-800  rounded-full text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-400  disabled:opacity-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div ref={horizontalThumbsRef} className="flex overflow-x-auto py-2 gap-2 scroll-smooth flex-1">
                          {(product.images ?? []).map((src, i) => (
                            <button
                              key={`mobile-${i}`}
                              onClick={() => handleThumbnailClick(src, i)}
                              className={`flex-shrink-0 w-14 h-14 p-1 rounded-lg border transition-all ${mainImage === src
                                ? "ring-2 ring-green-500 border-green-500 shadow-md"
                                : "border-gray-200 hover:border-green-300"
                                }`}
                            >
                              <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover rounded" height={100} width={100}/>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => navigateImage("next")}
                          disabled={totalImages <= 1}
                          className="p-2 ml-2 bg-green-200 dark:bg-zinc-600 hover:bg-green-300 dark:hover:bg-zinc-800  rounded-full text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-400 disabled:opacity-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>


                      {/* ⭐ DESKTOP ACTION BLOCK (Goal 1) */}
                      <div className="hidden md:block pt-4 border-t border-gray-200 mt-4">
                        <ActionBlock isMobile={false} />
                      </div>
                    </div>


                    {/* 2. RIGHT COLUMN: Product Info (60%) */}
                    <div className="space-y-6">
                      {/* Product Name & Category */}
                      <div>
                        <p className=" sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-green-50">{product.name}</p>
                        <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
                      </div>

                      {/* Price, Discount, Rating, Stock Status */}
                      <div className="space-y-3">
                        {config.showRating && product.rating && (
                          <div className="flex items-center space-x-2">
                            <StarRating rating={product.rating} />
                            <span className="text-gray-500 text-sm font-semibold">({product.rating.toFixed(1)})</span>
                          </div>
                        )}

                        {config.showPrice && (
                          <div className="flex items-baseline flex-wrap">
                            <p className="text-2xl lg:text-3xl text-green-700 mr-4 font-semibold">
                              ₹{productDetails?.finalPrice}
                            </p>
                            {productDetails?.isDiscountAvailable && config.showDiscount && (
                              <div className="flex items-center space-x-1">
                                <p className="text-lg text-gray-400 line-through">
                                  ₹{productDetails?.originalPrice}
                                </p>
                                <p className="text-md text-green-600 font-medium px-1 py-0.5 rounded-full">
                                  {productDetails?.discountPercentage}% off
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {config.showStock && (
                          <p className={`text-lg font-bold ${productDetails?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {productDetails?.isAvailable ? `In Stock (Stock: ${product.stock})` : 'Out of Stock'}
                          </p>
                        )}
                      </div>

                      {/* ⭐ MOBILE ACTION BLOCK (Goal 2) */}
                      <div className="md:hidden">
                        <ActionBlock isMobile={true} />
                      </div>

                      {/* Description and other Details (Rest of the Product Info) */}
                      {product.description && (
                        <div className="prose max-w-none pt-4 border-t border-gray-100">
                          <p className="sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-green-50 mb-2">Description</p>
                          <p className="text-zinc-600 dark:text-zinc-200">{product.description}</p>
                        </div>
                      )}

                      {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="sm:text-lg md:text-xl font-bold text-gray-900 dark:text-green-50 mb-3">Specifications</p>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 text-sm p-2">
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <div key={key} className="sm:col-span-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 p-2 rounded-lg">
                                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key.replace('_', ' ')}</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-500 dark:text-gray-300">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      {config.showTags && product.tags && product.tags.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-green-50  mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 shadow-sm"
                              >
                                # {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 space-y-8">
                    {/* Panel 1: Reviews */}
                    <div className="bg-white dark:bg-slate-950 rounded-xl p-6 shadow-2xl">
                      <p className="sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-whitetext-slate-900 dark:text-white mb-4">Customer Reviews ({reviews.length})</p>

                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-700 dark:text-green-100 italic">No reviews yet. Be the first!</p>
                      )}

                      {
                        actionButtonConfig.showReview && (
                          <button
                            onClick={() => !actionButtonConfig.enableReview ? () => { } : setIsReviewModalOpen(true)}
                            className={`mt-4 text-green-600 dark:text-green-400 hover:text-green-700 font-medium underline inline-flex items-center
                        ${!actionButtonConfig.enableReview ? "opacity-40 cursor-not-allowed" : ""}
                        `}
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Write a Review
                          </button>
                        )
                      }
                    </div>

                    {/* Panel 2: Similar Products */}
                    <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-xl">
                      <p className="sm:text-md md:text-lg lg:text-xl font-semibold text-zinc-900 dark:text-zinc-100  mb-4">Products in spot light</p>
                      <div className="flex overflow-x-auto space-x-4 py-2">
                        {featuredProducts && featuredProducts.map((fp) => (
                          <a key={fp.id} href={`/products/${fp.id}`} className="flex-shrink-0 w-48 p-3 rounded-xl hover:shadow-lg  inset-shadow-xs dark:inset-shadow-indigo-900/50 transition-transform hover:scale-105 duration-200 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950">
                            <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                              <img
                                src={fp.image as string}
                                alt={fp.name}
                                className="absolute inset-0 w-full h-full object-contain p-1"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Error')}
                              />
                            </div>
                            <p className="font-medium text-sm text-gray-800 dark:text-green-100 truncate">{fp.name}</p>
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
                </div>}
          </div>
        </div>
      </div>
      {/* ⭐ Review Modal */}
      {product && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          productDetails={product}
          onClose={() => setIsReviewModalOpen(false)}
          reviews={reviews}
        />
      )}
    </div >
  );
}