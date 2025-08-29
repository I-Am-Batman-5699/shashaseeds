"use client";

import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { HorizontalCarouselProps } from "@/types/components/carousel/mainCarosal";

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
    items,
    autoPlay = false,
    autoPlayInterval = 3000,
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const totalItems = items.length;

    const nextSlide = useCallback(() => {
        if (isDragging) {
            return;
        }
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [isDragging, totalItems]);

    const prevSlide = useCallback(() => {
        if (isDragging) {
            return;
        }
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [isDragging, totalItems]);

    const jumpToIndex = useCallback((index: number) => {
        setCurrentIndex(index % totalItems);
        if (isAutoPlaying) {
            setIsAutoPlaying(false);
            setTimeout(() => {
                setIsAutoPlaying(true);
            }, autoPlayInterval);
        }
    }, [isAutoPlaying, totalItems]);

    useEffect(() => {
        if (!isAutoPlaying || isDragging) {
            return;
        }

        const interval = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(interval);
    }, [isAutoPlaying, autoPlayInterval, nextSlide, isDragging]);

    // Touch/Mouse handlers for swiping
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        touchStartX.current = clientX;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        touchEndX.current = clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
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

    // Wheel handler for desktop scrolling
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            // Horizontal scroll
            if (e.deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // Get the scale and z-index for each item based on position relative to center
    const getItemStyle = (index: number) => {
        let relativeIndex = (index - currentIndex + totalItems) % totalItems;

        if (relativeIndex > totalItems / 2) {
            relativeIndex = relativeIndex - totalItems;
        }

        if (relativeIndex === 0) {
            return {
                scale: 1.5,
                zIndex: 30,
                opacity: 1,
                x: 0
            };
        } 
        else if (relativeIndex === -1) {
            return {
                scale: 0.8,
                zIndex: 10,
                opacity: 0.7,
                x: -270
            };
        } 
        else if (relativeIndex === 1) {
            return {
                scale: 0.8,
                zIndex: 10,
                opacity: 0.7,
                x: 270
            };
        } 
        else {
            return {
                scale: 0.6,
                zIndex: 1,
                opacity: 0,
                x: relativeIndex < 0 ? -400 : 400
            };
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No items to display
            </div>
        );
    }

    return (
        // <div className={`relative w-full overflow-hidden ${className}`}
        <div className={`relative w-full overflow-hidden ${className} bg-transparent`}>
            <div
                ref={carouselRef}
                className="relative h-60 md:h-85 flex items-center justify-evenly cursor-grab active:cursor-grabbing select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onWheel={handleWheel}
            >
                {items.map((item, index) => {
                    const style = getItemStyle(index);
                    let relativeIndex = (index - currentIndex + totalItems) % totalItems;

                    if (relativeIndex > totalItems / 2) {
                        relativeIndex = relativeIndex - totalItems;
                    }

                    const isVisible = Math.abs(relativeIndex) <= 1;

                    if (!isVisible) return null;

                    return (
                        <motion.div
                            key={`${item.id}-${index}`}
                            className={`absolute flex flex-col items-center bg-transparent rounded-lg lg:p-4 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            initial={false}
                            animate={{
                                scale: style.scale,
                                zIndex: style.zIndex,
                                opacity: style.opacity,
                                x: style.x
                            }}
                            transition={{
                                duration: 0.8,
                                ease: [0.25, 0.25, 0.25, 1]
                            }}
                            whileHover={relativeIndex === 0 ? { scale: style.scale * 1.1 } : {}}
                        >
                            <a href={item.href} className="no-underline">
                                <div className="flex flex-col items-center group cursor-pointer justify-center shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl inset-shadow-sm inset-shadow-indigo-200/50">
                                    <div className="mt-2 sm:mt-1 mb-1 relative w-30 h-30 md:w-40 md:h-40 rounded-xl overflow-hidden p-1">
                                        <Image
                                            width={400}
                                            height={400}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                console.error(`Failed to load image: ${item.image}`);
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4OFY4OEg0MFY0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4K';
                                            }}
                                            onLoad={() => console.log(`Successfully loaded: ${item.image}`)}
                                        />
                                    </div>
                                    <div className="md:p-1.5 p-1 sm:p-0.5 max-w-32 mb-1">
                                        <p className="text-xs font-medium text-center text-zinc-700 group-hover:text-zinc-900 transition-colors duration-300 truncate">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center md:mt-8 mt-6 space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => jumpToIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-blue-600 w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-100/60 hover:bg-indigo-200/60  rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
                aria-label="Previous slide"
            >
                <svg
                    className="w-5 h-5 text-zinc-700 group-hover:text-zinc-900 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-100/60 hover:bg-indigo-200/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
                aria-label="Next slide"
            >
                <svg
                    className="w-5 h-5 text-zinc-700 group-hover:text-zinc-900 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default HorizontalCarousel;