"use client";
import { Leaf, Star, MapPin, UserStar, Sprout, ShoppingCart, Spotlight } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchItems } from "@/lib/fetcher";
import { BenefitsSectionProps } from "@/types/components/sections/benefits";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

export default function BenefitsSection() {
    const [benefitContent, setBenefitContent] = useState<BenefitsSectionProps>();
    const [benefitContentLoading, setBenefitContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/benefits-content.json' });
        if (response.status === "S" && response.data) {
            setBenefitContent(response.data as BenefitsSectionProps);
        } else {
            console.error("Error fetching benefits content");
        }
        setBenefitContentLoading(false);
    }

    const getIconComponent = (iconName: string) => {
        const icon = iconName?.split("-").map(el => el.toLocaleLowerCase()).join("");
        const iconStyles = "h-6 w-6 sm:h-8 sm:w-8 text-green-500 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]";

        switch (icon) {
            case "leaf": return <Leaf className={iconStyles} />;
            case "star": return <Star className={iconStyles} />;
            case "mappin": return <MapPin className={iconStyles} />;
            case "userstar": return <UserStar className={iconStyles} />;
            case "sprout": return <Sprout className={iconStyles} />;
            case "shoppingcart": return <ShoppingCart className={iconStyles} />;
            case "spotlight": return <Spotlight className={iconStyles} />;
            default: return <Leaf className={iconStyles} />;
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50 transition-colors duration-500">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl w-full md:pb-8 pb-4 md:pt-4 pt-1 px-4 sm:px-6 lg:px-8">

                {/* 1. Helix Loader */}
                {benefitContentLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <HelixHorizontal />
                    </div>
                ) : (
                    benefitContent && (
                        <div className="rounded-2xl border border-theme shadow-lg md:p-4 p-2 inset-shadow-xs dark:inset-shadow-indigo-900/50 backdrop-blur-md space-y-6">
                            {/* 2. Header: Futuristic DNA Style */}
                            <ScrollFadeIn direction="down">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-100">
                                        Why Choose Our Seeds?
                                    </h2>
                                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-md md:text-lg max-w-2xl mx-auto">
                                        <span className="text-green-500 animate-pulse">::</span> We take pride in offering the highest quality seeds for your cultivation.
                                    </p>
                                </div>
                            </ScrollFadeIn>

                            {/* 3. Grid: Staggered Glassmorphism Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {benefitContent.benefits?.filter(b => b.visible).map((benefit, index) => (
                                    <ScrollFadeIn
                                        key={index}
                                        direction="up"
                                        delay={index * 150} // Staggered delay logic
                                    >
                                        <div className="group relative h-full p-8 rounded-3xl border-b-1 border-gray-400/40 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl shadow-xl hover:shadow-green-500/10 hover:border-green-500/30 transition-all duration-500">

                                            {/* Icon with Glow Container */}
                                            <div className="inline-flex p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-6 group-hover:scale-110 transition-transform duration-500">
                                                {getIconComponent(benefit.iconName || "leaf")}
                                            </div>

                                            {/* Text Content */}
                                            <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-zinc-900 dark:text-zinc-100">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                                {benefit.description}
                                            </p>

                                            {/* Decorative Corner Element */}
                                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 opacity-50 group-hover:bg-green-500 group-hover:animate-ping" />
                                        </div>
                                    </ScrollFadeIn>
                                ))}
                            </div>

                            {/* System Status Decoration */}
                            <ScrollFadeIn direction="up" delay={800}>
                                <div className="flex justify-center align-middle pt-2 opacity-30">
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-auto" />
                                    <span className="mx-4 text-[0.8rem] uppercase font-mono text-cyber tracking-[0.5em]">Inventory.Optimized</span>
                                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-auto" />
                                </div>
                            </ScrollFadeIn>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}