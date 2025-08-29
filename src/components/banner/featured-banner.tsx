"use client";

import React, { useEffect, useState } from 'react';

import { BannerItem } from '@/types/components/banner/banner';
import BannerCarousel from '@/components/banner/banner-carousel';

const Banner: React.FC = () => {

    const [items, setItems] = useState<BannerItem[]>([]);

    const fetchItems = async () => {
        try {
            const res = await fetch('/models/products/featured-banner.json');
            if (!res.ok) throw new Error('Failed to fetch items');
            const data: {items: BannerItem[]} = await res.json();
            setItems(transformItemsData(data.items));
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchItems();
    }, []);
    const transformItemsData = (items: BannerItem[]) => {
        return items.map(item => ({
            id: item.id,
            image: item.image,
            title: item.title,
            href: item.href,
            subtitle: item.subtitle
        }));
    };

    return (
        <div className="lg:p-6 bg-gradient-to-br from-green-50 to-green-100 p-8">
            <div className="mx-auto max-w-[90%] space-y-12 pb-8">
                <div className="from-green-200 to-green-300 rounded-2xl shadow-xl p-4 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                    <BannerCarousel
                        items={items}
                        autoPlay={true}
                        autoPlayInterval={3000}
                        className="shadow-2xl"
                        showLoadinIndicator={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Banner;