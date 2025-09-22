"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product, ProductProps } from '@/types/products/products';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const isAvailable = product.available && product.stock && product.stock > 0;

    const nextImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % (product.images ? product.images.length : 1));
        }
    };

    const prevImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + (product.images ? product.images.length : 0)) % (product.images ? product.images.length : 1));
        }
    };

    const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsInWishlist(!isInWishlist);
        console.log(`Product ${product.name} wishlist status: ${!isInWishlist}`);
    };

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAvailable) {
            // TODO: Implement add to cart logic (e.g., open a modal, send API request)
            console.log(`Added ${product.name} to cart.`);
        } else {
            // TODO: Implement notify me logic (e.g., open a modal, send API request)
            console.log(`Notify me for ${product.name}.`);
        }
    };

    const handleEnquiry = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Implement enquiry logic (e.g., open a contact form modal)
        console.log(`Enquiry for ${product.name}.`);
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 transition-transform duration-200 hover:scale-102">
            <div className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group z-20 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
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
                            className="transition-transform duration-300 hover:scale-105 my-4"
                        />
                        {/* Image navigation arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                    className="absolute inset-shadow-sm left-2 top-1/2 -translate-y-1/2 bg-green-50 hover:bg-green-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-blue-100"
                                    aria-label="Previous image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#155dfc"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                    className="absolute inset-shadow-sm right-2 top-1/2 -translate-y-1/2 bg-green-50 hover:bg-green-100 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-blue-100"
                                    aria-label="Next image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#155dfc"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                    </div>
                </Link>

                {/* Product Details */}
                <div className="p-4 mt-2">
                    {/* products name */}
                    <Link href={`/products/${product.slug}`} passHref>
                        <p className="sm:text:md md:text-xl font-semibold truncate hover:underline cursor-pointer text-zinc-800">{product.name}</p>
                    </Link>

                    {/* products id */}
                    <p className="text-gray-500 text-sm mb-2">{product.id}</p>

                    {/* ratings */}
                    {
                        product.rating &&
                        <div className="flex items-center text-yellow-500 mb-2">
                            {Array.from({ length: Math.floor(product.rating) }).map(el => {
                                return (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                                )
                            })}
                            {product.rating % 1 !== 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792V14.6564ZM11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            )}
                            {Array.from({ length: 5 - Math.ceil(product.rating) }).map(el => {
                                return (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                                )
                            })}
                            <span className="text-gray-400 text-xs ml-1">({product.rating})</span>
                        </div>
                    }

                    {/* price */}
                    <div className="flex items-end mb-2">
                        <p className="sm:text-lg md:text-xl lg:text-2xl font-semibold text-green-700">
                            ${(product.finalPrice && product.finalPrice.toFixed(2)) || (product.price && product.price.toFixed(2))}
                        </p>
                        {product.discountAvailable && (
                            <div className="flex items-center justify-center ml-2 space-x-2">
                                <p className="text-sm text-gray-400 line-through ml-2">
                                    ${product.price.toFixed(2)}
                                </p>
                                <p className="text-sm text-green-600">
                                    {product.discountPercentage}% off
                                </p>
                            </div>
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-col space-y-2">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-2 rounded-md text-sm font-semibold transition-colors
                                ${!isAvailable
                                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                } ${!isAvailable && 'opacity-90'}`}
                        >
                            <div className="flex flex-row items-center justify-center">
                                {
                                    isAvailable ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path></svg>
                                    ) :
                                        (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                                        )
                                }
                                <p className="ml-1">
                                    {isAvailable ? 'Add to Cart' : 'Notify Me'}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={handleEnquiry}
                            className="w-full border border-gray-300 rounded-md py-2 text-sm font-semibold text-gray-800 hover:text-gray-50 bg-green-100 hover:bg-green-700 transition-colors"
                        >
                            <div className="flex flex-row items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M17 2V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7V2H17ZM7 6H5V20H19V6H17V8H7V6ZM9 16V18H7V16H9ZM9 13V15H7V13H9ZM9 10V12H7V10H9ZM15 4H9V6H15V4Z"></path></svg>
                                <p className="ml-1">
                                    Enquiry
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;