"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchItems } from "@/lib/fetcher";
import { TestimonialProps, Testimonial } from "@/types/components/sections/testimonials";
import { Avatar } from "@mui/material";
import ProofModal from "@/components/modals/proof";


export default function TestimonialsSection() {

    const [testimonialContent, setTestimonialContent] = useState<TestimonialProps>();
    const [testimonialContentLoading, setTestimonialContentLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTestimony, setSlectedTestimony] = useState<Testimonial>();

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/testimonials-content.json' });
        if (response.status === "S" && response.data) {
            setTestimonialContent(transformItemsData(response.data));
        }
        else if (response.status === "E") {
            console.error(response.error);
        }
        else {
            console.error("Unknown error occurred while fetching testimonials content");
        }
        setTestimonialContentLoading(false);
    }

    const transformItemsData = (item: unknown) => {
        return item as TestimonialProps;
    }

    const getInitials = (name: string) => {
        return name.split(" ").map(el => el[0].toUpperCase()).join("");
    }

    const onTestimonyProofClick = (testimonial: Testimonial) => {
        console.log("Clicked proof for:", testimonial);
        setSlectedTestimony(testimonial);
        setOpenModal(true);
    }

    useEffect(() => {
        fetchItems();
        setTestimonialContentLoading(true);
    }, []);

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <ProofModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                testimony= {selectedTestimony}
            />
            <div className="max-w-[90%] xl:max-w-[80%] mx-auto md:pb-8 pb-4 md:pt-4 pt-1">
                {
                    testimonialContentLoading &&
                    <div className="flex items-center justify-center flex-row align-middle rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                        <div>
                            <p className="text-gray-700">Fetching latest testimonials...</p>
                        </div>
                    </div>
                }
                {testimonialContent && testimonialContent.testimonials && testimonialContentLoading === false &&
                    <div className={`rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1`}>
                        <section className="py-12 md:py-20">
                            <div className="container px-2 md:px-4 mx-auto text-zinc-950/90">
                                <div className="text-center mb-10">
                                    <p className="text:xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                                        {testimonialContent.section.title}
                                    </p>
                                    <p className="text-muted-foreground mt-2 max-w-[700px] mx-auto">
                                        {testimonialContent.section.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {testimonialContent.testimonials.map((testimonial, index) => (
                                        <Card key={index} className="">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-1 mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-800/50"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="italic mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center">
                                                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-green-100">
                                                            <Avatar
                                                                src={testimonial.image}
                                                                alt={`${getInitials(testimonial.name)}'s profile`}
                                                                className="border border-green-500/70"
                                                            >
                                                                {getInitials(testimonial.name)}
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex flex-col items-start align-middle justify-center ml-2">
                                                            <p className="sm:text-md md:text-lg font-normal">{testimonial.name}</p>
                                                            <p className="text-sm font-extralight text-muted-foreground text-zinc-400">{testimonial.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative bottom-1/6 flex justify-end b-10 align-bottom items-end pt-6">
                                                        <Camera className="h-4 w-4 sm:h-6 sm:w-6 text-zinc-600/50" onClick={() => onTestimonyProofClick(testimonial)} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                }
            </div>
        </div>
    );
}
