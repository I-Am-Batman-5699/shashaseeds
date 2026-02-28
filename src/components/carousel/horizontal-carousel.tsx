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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const totalItems = items.length;

    const nextSlide = useCallback(() => {
        if (isDragging) return;
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [isDragging, totalItems]);

    const prevSlide = useCallback(() => {
        if (isDragging) return;
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [isDragging, totalItems]);

    const jumpToIndex = useCallback((index: number) => {
        setCurrentIndex(index % totalItems);
    }, [totalItems]);

    useEffect(() => {
        if (!isAutoPlaying || isDragging) return;
        const interval = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(interval);
    }, [isAutoPlaying, autoPlayInterval, nextSlide, isDragging]);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        touchStartX.current = clientX;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        touchEndX.current = clientX;
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const deltaX = touchStartX.current - touchEndX.current;
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    const getItemStyle = (index: number) => {
        let relativeIndex = (index - currentIndex + totalItems) % totalItems;
        if (relativeIndex > totalItems / 2) relativeIndex -= totalItems;

        if (relativeIndex === 0) {
            return { scale: 1.4, zIndex: 30, opacity: 1, x: 0, filter: 'brightness(1.1)' };
        } else if (relativeIndex === -1) {
            return { scale: 0.85, zIndex: 10, opacity: 0.4, x: -280, filter: 'brightness(0.7) blur(1px)' };
        } else if (relativeIndex === 1) {
            return { scale: 0.85, zIndex: 10, opacity: 0.4, x: 280, filter: 'brightness(0.7) blur(1px)' };
        } else {
            return { scale: 0.5, zIndex: 1, opacity: 0, x: relativeIndex < 0 ? -450 : 450, filter: 'brightness(0.5) blur(4px)' };
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className={`relative w-full overflow-visible ${className}`}>
            <div
                ref={carouselRef}
                className="relative h-64 md:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                {items.map((item, index) => {
                    const style = getItemStyle(index);
                    const relativeIndex = (index - currentIndex + totalItems) % totalItems;
                    const isCenter = relativeIndex === 0 || relativeIndex === totalItems;
                    const isVisible = Math.abs(relativeIndex) <= 1 || Math.abs(relativeIndex - totalItems) <= 1;

                    if (!isVisible) return null;

                    return (
                        <motion.div
                            key={item.id}
                            className={`absolute flex flex-col items-center ${isCenter ? 'z-30' : 'z-10'}`}
                            initial={false}
                            animate={{
                                scale: style.scale,
                                zIndex: style.zIndex,
                                opacity: style.opacity,
                                x: style.x,
                                filter: style.filter
                            }}
                            // FIXED: Hover only scales the individual element, and only if it's the center one
                            whileHover={isCenter ? {
                                scale: style.scale * 1.05,
                                transition: { duration: 0.3 }
                            } : {}}
                            transition={{
                                duration: 0.8,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                        >
                            <a
                                href={item.href}
                                className={`group block no-underline ${isCenter ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            >
                                <div className={`relative flex flex-col items-center p-4 rounded-2xl transition-all duration-500 
                    ${isCenter ? 'bg-white/5 backdrop-blur-md border border-accent shadow-2xl inset-shadow-xs dark:inset-shadow-indigo-900/20' : ''}`}
                                >
                                    {/* Image Container */}
                                    <div className="relative w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-xl border border-gray-600/50">
                                        <Image
                                            width={400}
                                            height={400}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-contain p-2 transition-transform duration-500 hover:rotate-4 hover:scale-105"
                                        />
                                    </div>

                                    {/* Text - Only visible for center item */}
                                    <div className={`mt-3 text-center transition-all duration-500 ${isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">
                                            {item.title}
                                        </p>
                                        <p className="text-[10px] font-mono text-cyber uppercase tracking-widest">{item.id}</p>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col items-center gap-6 mt-4">
                {/* Rectangular Cyber Indicators */}
                <div className="flex space-x-1.5">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => jumpToIndex(index)}
                            className={`h-1 transition-all duration-500 rounded-full ${index === currentIndex ? 'w-8 bg-cyber' : 'w-3 bg-inverse'
                                }`}
                        />
                    ))}
                </div>

                {/* Minimalist Arrow Controls */}
                <div className="flex items-center gap-8">
                    <button onClick={prevSlide} className="p-2 text-zinc-400 hover:text-accent transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="text-[10px] font-mono text-zinc-400 tracking-[0.4em]">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
                    </div>
                    <button onClick={nextSlide} className="p-2 text-zinc-400 hover:text-accent transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HorizontalCarousel;