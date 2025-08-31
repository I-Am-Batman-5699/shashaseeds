"use client";

import React, { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel/horizontal-carousel';
import { FeaturedItems, CarouselItem, CarouselItemDisplay } from "@/types/components/carousel/mainCarosal";

const MainCarousel: React.FC = () => {

    const [products, setProducts] = useState<CarouselItemDisplay[]>([]);
    const [title, setTitle] = useState<string>('Featured Products');

    const fetchProducts = async () => {
        try {
            const res = await fetch('/models/products/featured-products.json');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data:FeaturedItems = await res.json();
            setProducts(transformProductData(data.products));
            setTitle(data.title || 'Featured Products');
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    const transformProductData = (products: CarouselItem[]) => {
        return products.map(product => ({
            id: product["product-id"],
            image: `/products${product.image}`,
            title: product.name,
            href: `/products/${product["product-id"]}`
        }));
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 ">
            <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="from-green-200 to-green-300 rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                {/* <div className="bg-gradient-to-r from-transparent via-black/30 to-black/60 rounded-2xl p-4"> */}
                    <p className="text-2xl font-semibold text-gray-700 m-2 text-center">
                        {title}
                    </p>
                    <HorizontalCarousel
                        items={products}
                        autoPlay={true}
                        autoPlayInterval={3000}
                        className="mb-8"
                    />
                {/* </div> */}
                </div>
                
            </div>
        </div>
    );
};

export default MainCarousel;