"use client";

import React, { useEffect, useState, useRef } from 'react';
import { FetchItems } from "@/lib/fetcher";
import { JoinUSProps } from "@/types/components/sections/join-us";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

export default function JoinUsSection() {
    const [joinUsContent, setJoinUsContent] = useState<JoinUSProps>();
    const [joinUsContentLoading, setJoinUsContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/join-us-content.json' });
        if (response.status === "S" && response.data) {
            setJoinUsContent(response.data as JoinUSProps);
        } else {
            console.error("Error fetching join-us content");
        }
        setJoinUsContentLoading(false);
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50">
            <div className="mx-auto lg:min-w-[85%] xl:max-w-6xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">
                {joinUsContentLoading ? (
                    <div className="py-20">
                        <HelixHorizontal />
                    </div>
                ) : (
                    joinUsContent && (
                        <ScrollFadeIn direction="up">
                            <section className="relative overflow-hidden w-full py-8 md:py-12">
                                <div className="relative mx-auto max-w-4xl flex flex-col justify-center items-center text-center space-y-6">
                                    
                                    {/* Futuristic Heading */}
                                    <p className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-200 drop-shadow-lg">
                                        {joinUsContent.title}
                                    </p>

                                    {/* Futuristic Sub-description */}
                                    <p className="sm:text-md md:text-lg lg:text-xl text-secondary-text font-mono leading-relaxed max-w-2xl">
                                        <span className="text-cyber"></span> {joinUsContent.description}
                                    </p>

                                    {/* Action Buttons styled like the reference navigation buttons */}
                                    <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                                        {joinUsContent.actions && joinUsContent.actions.map((el, i) => (
                                            <a 
                                                key={i} 
                                                href={el.href}
                                                className={`px-6 py-2 ${el.cssClass}`}
                                            >
                                                {el.label}
                                            </a>
                                        ))}
                                    </div>

                                    {/* System Status Decorative Element */}
                                    <div className="mt-2 pt-4 border-t border-theme/30 w-full max-w-xs opacity-60">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent">
                                            {joinUsContent.decorativeElementText}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </ScrollFadeIn>
                    )
                )}
            </div>
        </div>
    );
}