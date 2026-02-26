"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { FetchItems } from "@/lib/fetcher";
import { THeroContent } from "@/types/components/sections/hero";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

export default function HeroSectionNormal() {
    const [heroContent, setHeroContent] = useState<THeroContent>();
    const [heroContentLoading, setHeroContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/hero-content.json' });
        if (response.status === "S" && response.data) {
            setHeroContent(response.data as THeroContent);
        } else {
            console.error("Error fetching hero content");
        }
        setHeroContentLoading(false);
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50 min-h-[70vh] justify-center">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">
                {/* 1. DNA Helix Loader */}
                {heroContentLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <HelixHorizontal />
                    </div>
                ) : (
                    heroContent && (
                        /* 2. ScrollFadeIn with glassmorphism */
                        <ScrollFadeIn direction="up" className="relative">
                            <section className={`relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-2xl px-6 py-12 md:py-20`}>

                                {/* Background Image/Pattern Logic */}
                                {heroContent.backgroundPattern.showPattern && (
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <Image
                                            src={heroContent.backgroundPattern.src}
                                            alt={heroContent.backgroundPattern.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="relative z-10 mx-auto max-w-5xl flex flex-col justify-center items-center text-center">

                                    {/* 3. Futuristic Heading Style */}
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-100 drop-shadow-md leading-none">
                                        {heroContent.title && (typeof heroContent.title === 'object') && heroContent.title.map((part, index) =>
                                            typeof part === 'string' ? (
                                                <span key={index}>{part} </span>
                                            ) : (
                                                <span
                                                    key={index}
                                                    className={part.highlight ? "text-green-600 dark:text-green-400 inline-block" : ""}
                                                >
                                                    {part.text}
                                                </span>
                                            )
                                        )}
                                    </h1>

                                    {/* 4. Sub-description Style */}
                                    <p className="mt-8 text-md md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed max-w-3xl">
                                        {heroContent.subtitle}
                                    </p>

                                    {/* 5. Action Buttons (Unified UI) */}
                                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                                        <a
                                            href={heroContent.primaryButton.link}
                                            className="px-8 py-3 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold tracking-tight hover:scale-105 transition-transform shadow-xl"
                                        >
                                            {heroContent.primaryButton.text}
                                        </a>
                                        <a
                                            href={heroContent.secondaryButton.link}
                                            className="px-8 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            {heroContent.secondaryButton.text}
                                        </a>
                                    </div>

                                </div>
                                {/* Decorative Icon Element */}
                                <div className="absolute bottom-0 right-0 opacity-20 mr-1 mb-1 hidden sm:block">
                                    <Image
                                        src={heroContent.image.src}
                                        alt={heroContent.image.alt}
                                        width={300}
                                        height={300}
                                        className="object-center object-contain opacity-90 rounded-[50%] shadow-lg bg-gradient-to-br from-green-50 to-green-100"
                                    />
                                </div>
                            </section>
                        </ScrollFadeIn>
                    )
                )}
            </div>
        </div>
    );
}