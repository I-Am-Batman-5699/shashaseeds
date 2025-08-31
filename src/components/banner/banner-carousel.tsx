"use client";

import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { BannerCarouselProps } from '@/types/components/banner/banner';
import useBreakpoint from '@/lib/breakpoint';

const BannerCarousel: React.FC<BannerCarouselProps> = ({
    items,
    autoPlay = true,
    autoPlayInterval = 4000,
    className = "",
    showLoadinIndicator = true
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const bannerRef = useRef<HTMLDivElement>(null);

    const totalItems = items.length;

    const { isXs, isSm, isMd, isLg } = useBreakpoint();

    const nextSlide = useCallback(() => {
        if (isDragging || totalItems <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [isDragging, totalItems]);

    const prevSlide = useCallback(() => {
        if (isDragging || totalItems <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [isDragging, totalItems]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isDragging || totalItems <= 1) return;

        const interval = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, nextSlide, isDragging, totalItems]);

    // Touch/Mouse handlers for swiping
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (totalItems <= 1) return;
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        touchStartX.current = clientX;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging || totalItems <= 1) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        touchEndX.current = clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging || totalItems <= 1) return;
        setIsDragging(false);

        const deltaX = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className={`flex items-center justify-center md:h-85 sm:h-60 xs:h-40 h-30 lg:h-100 text-gray-500 bg-indigo-100/50 rounded-xl p-4`}>
                No items to display
            </div>
        );
    }

    return (
        <div className={`relative w-full py-2 overflow-hidden rounded-xl ${className} bg-gradient-to-r from-black/60 via-black/30 to-transparent`}>
            <div
                className={`relative md:h-85 sm:h-60 xs:h-40 h-30 lg:h-100`}
                ref={bannerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="absolute inset-0 w-full h-full"
                        initial={false}
                        animate={{
                            opacity: index === currentIndex ? 1 : 0,
                            scale: index === currentIndex ? 1 : 1.05,
                            zIndex: index === currentIndex ? 10 : 1
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.25, 0.25, 1]
                        }}
                    >
                        <a className="block w-full h-full group">
                            <div className="relative w-full h-full overflow-hidden">
                                {/* Background Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-[90%] object-contain group-hover:scale-102 transition-transform duration-700"
                                    onError={(e) => {
                                        console.error(`Failed to load banner image: ${item.image}`);
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNzUgMTc1SDQyNVYyMjVIMzc1VjE3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4K';
                                    }}
                                />
                                
                                {/* Gradient Overlay */}
                                {/* <div className="absolute bg-gradient-to-r from-zinc-800/60 via-indigo-zinc/30 to-transparent" /> */}
                                
                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex items-center justify-start md:p-18 sm:p-8 p-4 md:m-2 m-0">
                                    <div className="text-amber-50/90 max-w-xl">
                                        <motion.p 
                                            className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold md:mb-4 mb-0 group-hover:text-amber-50 transition-colors duration-300"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                        >
                                            {item.title}
                                        </motion.p>
                                        
                                        {item.subtitle && (
                                            <motion.p 
                                                className="text-xs sm:text-sm md:text-lg lg:text-xl mb-1 sm:mb-6 text-gray-200/80 group-hover:text-gray-200 transition-colors duration-300 max-w-[30vw] lg:max-w-[60vw] xs:ml-2"
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                                                transition={{ delay: 0.5, duration: 0.6 }}
                                            >
                                                {item.subtitle}
                                            </motion.p>
                                        )}
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: index === currentIndex ? 1 : 0, y: index === currentIndex ? 0 : 30 }}
                                            transition={{ delay: 0.7, duration: 0.6 }}
                                        >
                                            <span className="inline-flex items-center px-3 py-1 sm:px-6 sm:py-3 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm rounded-lg text-xs sm:text-sm md:text-lg lg:text-xl font-semibold transition-all duration-300 group-hover:scale-105">
                                                Learn More
                                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Click indicator for single item */}
                                {totalItems === 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-30">
                                        Click to explore
                                    </div>
                                )}
                            </div>
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* Navigation Controls - Only show if more than 1 item */}
            {totalItems > 1 && (
                <>
                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-40">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'bg-gray-500 w-8'
                                        : 'bg-gray-200 hover:bg-gray-100'
                                }`}
                                aria-label={`Go to banner ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-gray-400/30 hover:bg-gray-300/30 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-20 opacity-40 md:opacity-100 hover:opacity-100"
                        aria-label="Previous banner"
                    >
                        <svg
                            className="w-6 h-6 text-white drop-shadow-sm transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-gray-500/40 hover:bg-gray-600/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-20 opacity-40 md:opacity-100 hover:opacity-100"
                        aria-label="Next banner"
                    >
                        <svg
                            className="w-6 h-6 text-white drop-shadow-sm transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Auto-play Progress Bar - Only show if more than 1 item and auto-play is on */}
            {totalItems > 1 && autoPlay && showLoadinIndicator && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <motion.div
                        className="h-full bg-white"
                        key={currentIndex}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                    />
                </div>
            )}
        </div>
    );
};

export default BannerCarousel;