"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchItems } from "@/lib/fetcher";
import { TestimonialProps, Testimonial } from "@/types/components/sections/testimonials";
import { Avatar } from "@mui/material";
import ProofModal from "@/components/modals/proof";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

export default function TestimonialsSection() {
    const [testimonialContent, setTestimonialContent] = useState<TestimonialProps>();
    const [testimonialContentLoading, setTestimonialContentLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTestimony, setSlectedTestimony] = useState<Testimonial>();

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/testimonials-content.json' });
        if (response.status === "S" && response.data) {
            setTestimonialContent(response.data as TestimonialProps);
        }
        setTestimonialContentLoading(false);
    }

    const getInitials = (name: string) => {
        return name.split(" ").map(el => el[0].toUpperCase()).join("");
    }

    const onTestimonyProofClick = (testimonial: Testimonial) => {
        setSlectedTestimony(testimonial);
        setOpenModal(true);
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50 transition-colors duration-500 ">
            <ProofModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                testimony={selectedTestimony}
            />

            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl md:pb-16 pb-8 md:pt-8 pt-2 px-4 sm:px-6 lg:px-8">
                
                {/* 1. Loader: Helix DNA DNA Pattern */}
                {testimonialContentLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <HelixHorizontal />
                    </div>
                ) : (
                    testimonialContent && (
                        <div className="space-y-8 rounded-2xl border border-theme  shadow-lg md:p-4 p-2 inset-shadow-xs dark:inset-shadow-indigo-900/50 backdrop-blur-md">
                            
                            {/* 2. Header: Futuristic DNA Style */}
                            <ScrollFadeIn direction="down">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-100">
                                        {testimonialContent.section.title}
                                    </h2>
                                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-md md:text-lg max-w-2xl mx-auto">
                                        <span className="text-green-500 animate-pulse">::</span> {testimonialContent.section.description}
                                    </p>
                                </div>
                            </ScrollFadeIn>

                            {/* 3. Grid: Staggered Verified Logs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {testimonialContent.testimonials.map((testimonial, index) => (
                                    <ScrollFadeIn 
                                        key={index} 
                                        direction="up" 
                                        delay={index * 120}
                                    >
                                        <Card className="group relative h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-xl hover:border-green-500/40 transition-all duration-500 overflow-hidden">
                                            <CardContent className="p-8 flex flex-col h-full">
                                                
                                                {/* Rating & Action Button */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < testimonial.rating ? "text-green-500 fill-green-500" : "text-zinc-300 dark:text-zinc-700"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button 
                                                        onClick={() => onTestimonyProofClick(testimonial)}
                                                        className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-green-500 hover:bg-green-500/10 transition-colors"
                                                        title="View Proof"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Testimonial Body */}
                                                <div className="flex-grow">
                                                    <p className="text-lg italic leading-relaxed text-zinc-700 dark:text-zinc-300 mb-8">
                                                        &ldquo;{testimonial.comment}&rdquo;
                                                    </p>
                                                </div>

                                                {/* User Info / Metadata Footer */}
                                                <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-4">
                                                    <Avatar
                                                        src={testimonial.image}
                                                        className="border-2 border-green-500/50 w-12 h-12"
                                                        sx={{ width: 48, height: 48 }}
                                                    >
                                                        {getInitials(testimonial.name)}
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                                                            {testimonial.name}
                                                        </span>
                                                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 mt-1">
                                                            {testimonial.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Corner Decorative Accent */}
                                                <div className="absolute top-0 right-0 p-1">
                                                    <div className="w-8 h-8 border-t border-r border-zinc-300 dark:border-zinc-700 opacity-20" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </ScrollFadeIn>
                                ))}
                            </div>

                            {/* Decorative System Footer */}
                            <ScrollFadeIn direction="up" delay={600}>
                                <div className="text-center opacity-30 pt-2">
                                    <p className="text-[0.8rem] text-cyber font-mono tracking-[0.4em] uppercase">
                                        Data.Verified // Transmission.Complete
                                    </p>
                                </div>
                            </ScrollFadeIn>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}