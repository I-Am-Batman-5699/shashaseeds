"use client";

import React, { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel/horizontal-carousel';
import { FeaturedItems, CarouselItem, CarouselItemDisplay } from "@/types/components/carousel/mainCarosal";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

const MainCarousel: React.FC = () => {
    const [products, setProducts] = useState<CarouselItemDisplay[]>([]);
    const [title, setTitle] = useState<string>('Featured Products');
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/models/products/featured-products.json');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data: FeaturedItems = await res.json();
            setProducts(transformProductData(data.products));
            setTitle(data.title || 'Featured Products');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const transformProductData = (products: CarouselItem[]) => {
        return products.map(product => ({
            id: product["product-id"],
            image: `/products/${product["product-id"]}-nobg.png`,
            title: product.name,
            href: `/products/${product["product-id"]}`
        }));
    };

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="py-20">
                        <HelixHorizontal />
                    </div>
                ) : (
                    <ScrollFadeIn direction="up">
                        {/* Section Header */}
                        <div className="flex flex-col items-center justify-center mb-6 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                                <span className="h-[0.1rem] w-8 bg-accent/50"></span>
                                <p className="text-[0.5rem] font-mono uppercase tracking-[0.3em] text-cyber">
                                    Inventory_Database
                                </p>
                                <span className="h-[0.1rem] w-8 bg-accent/50"></span>
                            </div>
                            
                            <p className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-200 text-center">
                                {title}
                            </p>
                        </div>

                        {/* Carousel Container */}
                        <div className="relative group">
                            <HorizontalCarousel
                                items={products}
                                autoPlay={true}
                                autoPlayInterval={3500}
                                className="mb-4"
                            />
                            
                            {/* Decorative Corner Flashes */}
                            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-accent opacity-50"></div>
                            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-accent opacity-50"></div>
                        </div>

                        {/* Footer decorative line */}
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-theme to-transparent opacity-20 mt-4"></div>
                    </ScrollFadeIn>
                )}
            </div>
        </div>
    );
};

export default MainCarousel;