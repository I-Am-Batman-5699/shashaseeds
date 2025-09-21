"use client";

// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion'; // Assuming Framer Motion is still in use for other parts

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false); // State for wishlist status

    const discountedPrice = product.price * (1 - product.discount / 100);
    const isAvailable = product.available && product.stock > 0; // Check both 'available' and 'stock'

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault(); // Prevent navigating to product page
        e.stopPropagation(); // Prevent event bubbling up to the card link
        setIsInWishlist(!isInWishlist);
        // TODO: Add actual logic to add/remove from global wishlist state or API
        console.log(`Product ${product.name} wishlist status: ${!isInWishlist}`);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAvailable) {
            // TODO: Add actual add to cart logic
            console.log(`Added ${product.name} to cart.`);
        } else {
            // TODO: Implement notify me logic (e.g., open a modal, send API request)
            console.log(`Notify me for ${product.name}.`);
        }
    };

    const handleEnquiry = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Implement enquiry logic (e.g., open a contact form modal)
        console.log(`Enquiry for ${product.name}.`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group">
            {/* Wishlist Icon */}
            <button
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all z-10 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill={isInWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {isInWishlist ? (
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    ) : (
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    )}
                </svg>
            </button>

            {/* Product Image and Carousel */}
            <Link href={`/products/${product.slug}`}>
                <div className="relative w-full h-64">
                    <Image
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        className="transition-transform duration-300 hover:scale-105"
                    />
                    {/* Image navigation arrows */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                aria-label="Previous image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                aria-label="Next image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>
            </Link>

            {/* Product Details */}
            <div className="p-4 pt-0"> {/* Adjusted padding-top to account for image */}
                <Link href={`/products/${product.slug}`} passHref>
                    <h3 className="text-xl font-bold truncate hover:underline cursor-pointer">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-2">ID: {product.id}</p>
                <div className="flex items-center text-yellow-500 mb-2">
                    {'★'.repeat(Math.floor(product.rating))}
                    <span className="text-gray-400 text-sm ml-1">({product.rating})</span>
                </div>
                <div className="flex items-end mb-2">
                    <p className="text-2xl font-semibold text-green-700">
                        ${discountedPrice.toFixed(2)}
                    </p>
                    {product.discount > 0 && (
                        <p className="text-sm text-gray-400 line-through ml-2">
                            ${product.price.toFixed(2)}
                        </p>
                    )}
                </div>
                <p className={`text-sm font-medium ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col space-y-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable && !product.canNotify} // Assuming a 'canNotify' flag
                        className={`w-full py-2 rounded-md text-sm font-semibold transition-colors
              ${isAvailable
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600' // 'Notify Me' style
                            } ${!isAvailable && 'opacity-70 cursor-not-allowed'}`}
                    >
                        {isAvailable ? 'Add to Cart' : 'Notify Me'}
                    </button>
                    <button
                        onClick={handleEnquiry}
                        className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                        Enquiry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;