"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import { FetchItems } from "@/lib/fetcher";
import { THeroContent } from "@/types/components/sections/hero";

export default function HeroSection() {

    const [heroContent, setHeroContent] = useState<THeroContent>();
    const [heroContentLoading, setHeroContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/hero-content.json' });
        if (response.status === "S" && response.data) {
            setHeroContent(transformItemsData(response.data));
        }
        else if (response.status === "E") {
            console.error(response.error);
        }
        else {
            console.error("Unknown error occurred while fetching hero content");
        }
        setHeroContentLoading(false);
    }

    const transformItemsData = (item: unknown) => {
        return item as THeroContent;
    }

    useEffect(() => {
        fetchItems();
        setHeroContentLoading(true);
    }, []);

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="max-w-[95%] mx-auto md:pb-8 pb-4 md:pt-4 pt-1">
                {
                    heroContentLoading &&
                    <div className="flex items-center justify-center flex-row align-middle from-green-200 to-green-300 rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                        <div>
                            <p className="text-gray-700">Fetching latest updates...</p>
                        </div>
                    </div>
                }
                {heroContent && heroContentLoading === false &&
                    <div className={`from-green-200 to-green-300 rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1`}>
                        <section className={`relative overflow-hidden ${heroContent.backgroundPattern.showPattern ? 'bg-zinc-900/70' : ''}`}>
                            {/* Background pattern */}
                            {heroContent.backgroundPattern.showPattern &&
                                <div className="absolute inset-0 opacity-60">
                                    <Image
                                        src={heroContent.backgroundPattern.src}
                                        alt={heroContent.backgroundPattern.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            }

                            <div className={`relative mx-auto max-w-7xl px-6 lg:py-16 md:py-10 py-6 lg:flex lg:items-center lg:gap-16 lg:px-12`}>
                                {/* Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="lg:w-1/2"
                                >
                                    <p className={`md:text-4xl text-xl font-semibold ${heroContent.backgroundPattern.showPattern ? 'text-amber-50' : 'text-green-900'} sm:text-2xl lg:text-6xl`}>
                                        {heroContent.title && ( typeof heroContent.title === 'object') && heroContent.title.map((part, index) =>
                                            typeof part === 'string' ? (<span key={index}>{part} </span>) :
                                                part.highlight ? (<span key={index} className={ `${heroContent.backgroundPattern.showPattern ? 'text-green-300' : 'text-green-700'} font-bold`}>{part.text} </span>) :
                                                    (<span key={index}>{part.text} </span>)
                                        )}
                                    </p>

                                    <p className={`mt-6 text-md md:text-lg lg:text-xl ${heroContent.backgroundPattern.showPattern ? 'text-amber-50' : 'text-green-800'}  leading-relaxed`}>
                                        {heroContent.subtitle}
                                    </p>

                                    <div className="mt-4 md:mt-8 flex gap-4">
                                        <a
                                            href={heroContent.primaryButton.link}
                                            className="font-semibold text-sm md:text-lg rounded-2xl bg-green-700 hover:bg-green-800 px-6 py-3 text-white shadow-lg transition"
                                        >
                                            {heroContent.primaryButton.text}
                                        </a>
                                        <a
                                            href={heroContent.secondaryButton.link}
                                            className={`font-semibold text-sm md:text-lg rounded-2xl border border-green-600 hover:border-green-800 hover:bg-green-100 px-6 py-3 text-green-700 transition ${heroContent.backgroundPattern.showPattern ? 'bg-green-50/80' : ''}`}
                                        >
                                            {heroContent.secondaryButton.text}
                                        </a>
                                    </div>
                                </motion.div>

                                {/* Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="mt-12 lg:mt-0 lg:w-1/2 hidden lg:block"
                                >
                                    <Image
                                        src={heroContent.image.src}
                                        alt={heroContent.image.alt}
                                        width={heroContent.image.width}
                                        height={heroContent.image.height}
                                        className="rounded-[50%] shadow-lg"
                                    />
                                </motion.div>
                            </div>
                        </section>
                    </div>
                }
            </div>
        </div>
    );
}
