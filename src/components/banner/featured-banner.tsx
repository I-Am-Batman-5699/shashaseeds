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
            subtitle: item.subtitle,
            buttonName: item.buttonName
        }));
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="mx-auto max-w-[95%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
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