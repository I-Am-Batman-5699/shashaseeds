"use client";

import React, { useEffect, useState, useRef } from 'react';
import { BannerItem } from '@/types/components/banner/banner';
import BannerCarousel from '@/components/banner/banner-carousel';
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";
import { useGlobalData } from "@/context/global-data-context";
import { AppData } from '@/types/appContextText';

const Banner: React.FC = () => {
    const [items, setItems] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { appData, isGlobalDataLoading } = useGlobalData();

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
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">
                {loading || isGlobalDataLoading ? (
                    <div className="py-12">
                        <HelixHorizontal />
                    </div>
                ) : (
                    <ScrollFadeIn direction="down" delay={100}>
                        {/* Status Bar decorative element typical of your futuristic UI */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-600/50 mb-2">
                            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-accent animate-pulse">
                                ● Hot News
                            </span>
                            <span className="text-[0.5rem] font-mono text-cyber">
                                app version: {(appData as AppData).version}
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