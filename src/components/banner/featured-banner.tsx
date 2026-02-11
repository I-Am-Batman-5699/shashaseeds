"use client";

import React, { useEffect, useState, useRef } from 'react';
import { BannerItem } from '@/types/components/banner/banner';
import BannerCarousel from '@/components/banner/banner-carousel';
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import appContext from "../../../public/models/appContentTexts.json";

const ScrollFadeIn = ({ children, direction = 'up', delay = 0, className = '' }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right' | 'down', delay?: number, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);

    const baseTransition = `transition-all duration-1000 ease-out ${className}`;
    let transformClasses = 'opacity-0';
    if (direction === 'up') transformClasses += ' translate-y-8';
    else if (direction === 'left') transformClasses += ' -translate-x-8';
    else if (direction === 'right') transformClasses += ' translate-x-8';
    else if (direction === 'down') transformClasses += ' -translate-y-8';

    const visibleClasses = 'opacity-100 translate-y-0 translate-x-0';

    return (
        <div
            ref={ref}
            className={`${baseTransition} ${isVisible ? visibleClasses : transformClasses} rounded-2xl border border-theme bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-slate-900/50 dark:to-slate-950/50 shadow-xl md:p-4 p-2 inset-shadow-xs dark:inset-shadow-indigo-900/50 backdrop-blur-md`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const Banner: React.FC = () => {
    const [items, setItems] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const {appData} = appContext;

    const fetchItems = async () => {
        try {
            const res = await fetch('/models/products/featured-banner.json');
            if (!res.ok) throw new Error('Failed to fetch items');
            const data: { items: BannerItem[] } = await res.json();
            setItems(data.items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="py-12">
                        <HelixHorizontal />
                    </div>
                ) : (
                    <ScrollFadeIn direction="down" delay={100}>
                        {/* Status Bar decorative element typical of your futuristic UI */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-600/50 mb-2">
                            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-accent animate-pulse">
                                ● Featured Products
                            </span>
                            <span className="text-[0.5rem] font-mono text-cyber">
                                app version: {appData.version}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl">
                            <BannerCarousel
                                items={items}
                                autoPlay={true}
                                autoPlayInterval={4000}
                                className="shadow-2xl transition-transform duration-700 hover:scale-[1.01]"
                                showLoadinIndicator={false}
                            />
                        </div>
                        
                        {/* Bottom edge detail to reinforce the high-tech look */}
                        <div className="mt-4 flex justify-end">
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent to-accent/50 rounded-full" />
                        </div>
                    </ScrollFadeIn>
                )}
            </div>
        </div>
    );
};

export default Banner;