"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import { FetchItems } from "@/lib/fetcher";
import { THeroContent } from "@/types/components/sections/hero";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import appContext from "../../public/models/appContentTexts.json";

export default function HeroSection() {
    const [heroContent, setHeroContent] = useState<THeroContent>();
    const [heroContentLoading, setHeroContentLoading] = useState(true);
    const {appData} = appContext;

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/hero-content.json' });
        if (response.status === "S" && response.data) {
            setHeroContent(response.data as THeroContent);
        } else {
            console.error(response.error || "Unknown error occurred");
        }
        setHeroContentLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="relative min-h-[70vh] flex items-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Background Ambient Glow - uses rem for scaling blur and size */}
            <div className="absolute top-0 left-[25%] w-[24rem] h-[24rem] bg-accent/10 blur-[8rem] rounded-full pointer-events-none" />
            
            <div className="max-w-[95%] mx-auto w-full md:pb-[2rem] pb-[1rem] md:pt-[1rem] pt-[0.25rem]">
                {heroContentLoading ? (
                    <div className="flex flex-col items-center justify-center py-[5rem] space-y-[1rem]">
                        <HelixHorizontal />
                        <p className="text-[0.625rem] font-mono uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
                            Initializing_System_Core
                        </p>
                    </div>
                ) : heroContent && (
                    <div className="rounded-[1.25rem] border border-theme shadow-2xl md:p-[2rem] p-[1rem] backdrop-blur-md relative overflow-hidden">
                        
                        {/* HUD Details */}
                        <div className="absolute top-[1rem] right-[1.5rem] hidden md:block">
                            <p className="text-[0.56rem] font-mono text-cyber opacity-50 tracking-tighter">
                                {appData.slogan}
                            </p>
                        </div>

                        <section className="relative lg:flex lg:items-center lg:gap-[4rem]">
                            {/* Text Content Area */}
                            <motion.div
                                initial={{ opacity: 0, x: "-2rem" }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="lg:w-[60%]"
                            >
                                <div className="mb-[1rem] flex items-center gap-[0.5rem]">
                                    <span className="w-[2rem] h-[0.06rem] bg-accent"></span>
                                    <span className="text-[0.625rem] font-mono text-cyber uppercase tracking-[0.4em]">{appData.appName}</span>
                                </div>

                                <p className="text-[2.5rem] md:text-[3.75rem] lg:text-[4.5rem] font-black uppercase tracking-tighter leading-[0.9] text-zinc-900 dark:text-zinc-100">
                                    {heroContent.title && Array.isArray(heroContent.title) && heroContent.title.map((part, index) =>
                                        typeof part === 'string' ? (
                                            <span key={index}>{part} </span>
                                        ) : (
                                            <span key={index} className="text-cyber italic font-black">
                                                {part.text}{" "}
                                            </span>
                                        )
                                    )}
                                </p>

                                <p className="mt-[2rem] text-[1.125rem] md:text-[1.25rem] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-[36rem]">
                                    {heroContent.subtitle}
                                </p>

                                <div className="mt-[2.5rem] flex flex-col sm:flex-row gap-[1rem]">
                                    <a
                                        href={heroContent.primaryButton.link}
                                        className="relative group px-[2rem] py-[1rem] bg-zinc-900 dark:bg-accent text-white dark:text-zinc-200 font-bold uppercase tracking-widest text-[0.875rem] transition-all hover:scale-105 active:scale-95 text-center overflow-hidden border border-inverse"
                                    >
                                        <span className="relative z-10">{heroContent.primaryButton.text}</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </a>
                                    
                                    <a
                                        href={heroContent.secondaryButton.link}
                                        className="px-[2rem] py-[1rem] border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-[0.875rem] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-center"
                                    >
                                        {heroContent.secondaryButton.text}
                                    </a>
                                </div>
                            </motion.div>

                            {/* Image Section - Constrained with rem to prevent overflow */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="mt-[3rem] lg:mt-0 lg:w-[40%] relative hidden lg:flex justify-center items-center"
                            >
                                {/* Animated Outer Ring */}
                                <div className="absolute w-[18.75rem] h-[18.75rem] md:w-[28rem] md:h-[28rem] border-dashed border-[0.125rem] border-accent/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
                                
                                {/* The HUD Frame - max-width in rem ensures it doesn't grow too large */}
                                <div className="relative z-10 w-full max-w-[25rem] aspect-square p-[0.5rem] border border-theme bg-zinc-100/50 dark:bg-zinc-900/50 shadow-2xl overflow-hidden shadow-accent/10 [clip-path:polygon(10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%)]">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={heroContent.image.src}
                                            alt={heroContent.image.alt}
                                            fill
                                            className="object-contain p-[1rem] transition-transform duration-700 hover:scale-105"
                                            priority
                                        />
                                    </div>
                                    {/* Tech Scanline Overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_0.25rem] opacity-10" />
                                </div>

                                {/* HUD Visual Accents */}
                                <div className="absolute -bottom-[0.5rem] -left-[0.5rem] w-[2.5rem] h-[2.5rem] border-b-[0.125rem] border-l-[0.125rem] border-cyber z-20" />
                                <div className="absolute -top-[0.5rem] -right-[0.5rem] w-[2.5rem] h-[2.5rem] border-t-[0.125rem] border-r-[0.125rem] border-cyber z-20 opacity-30" />
                            </motion.div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}