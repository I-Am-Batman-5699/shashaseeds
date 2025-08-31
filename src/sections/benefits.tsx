"use client";
import { Leaf, Star, MapPin, UserStar, Sprout, ShoppingCart, Spotlight } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchItems } from "@/lib/fetcher";
import { BenefitsSectionProps } from "@/types/components/sections/benefits";

export default function BenefitsSection() {

    const [benefitContent, setBenefitContent] = useState<BenefitsSectionProps>();
    const [benefitContentLoading, setBenefitContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/benefits-content.json' });
        if (response.status === "S" && response.data) {
            setBenefitContent(transformItemsData(response.data));
        }
        else if (response.status === "E") {
            console.error(response.error);
        }
        else {
            console.error("Unknown error occurred while fetching benefits content");
        }
        setBenefitContentLoading(false);
    }

    const transformItemsData = (item: unknown) => {
        return item as BenefitsSectionProps;
    }

    const getIconComponent = (iconName: string) => {
        const icon = iconName?.split("-").map(el => el.toLocaleLowerCase()).join("");
        switch (icon) {
            case "leaf":
                return <Leaf className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "star":
                return <Star className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "mappin":
                return <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "userstar":
                return <UserStar className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "sprout":
                return <Sprout className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "shoppingcart":
                return <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            case "spotlight":
                return <Spotlight className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
            default:
                return <Leaf className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />;
        }
    }

    useEffect(() => {
        fetchItems();
        setBenefitContentLoading(true);
    }, []);


    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="max-w-[90%] xl:max-w-[80%] mx-auto md:pb-8 pb-4 md:pt-4 pt-1">
                {
                    benefitContentLoading &&
                    <div className="flex items-center justify-center flex-row align-middle rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                        <div>
                            <p className="text-gray-700">Fetching latest benifits...</p>
                        </div>
                    </div>
                }
                {benefitContent && benefitContentLoading === false &&
                    <div className={`rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1`}>
                        <section className="py-6 md:py-14">
                            <div className="container px-2 md:px-4 mx-auto text-zinc-950/90">
                                <div className="text-center mb-10">
                                    <p className="text:xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                                        Why Choose Our Seeds?
                                    </p>
                                    <p className="text-muted-foreground mt-2 max-w-[700px] mx-auto">
                                        We take pride in offering the highest quality seeds for your cultivation
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-8 gap-6">
                                    {benefitContent.benefits && benefitContent.benefits.length > 0 &&
                                        benefitContent.benefits.map((benefit, index) => (
                                            <div key={index + 'benefits'}>
                                                {benefit.visible &&
                                                    <div className="flex flex-col items-center text-center p-4 shadow-sm rounded-lg inset-shadow-xs inset-shadow-indigo-200/50">
                                                        <div className="bg-green-100 p-3 rounded-full mb-4">
                                                            {getIconComponent(benefit.iconName || "leaf")}
                                                        </div>
                                                        <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                                                            {benefit.title}
                                                        </p>
                                                        <p className="text-sm sm:text-md md:text-lg text-muted-foreground">
                                                            {benefit.description}
                                                        </p>
                                                    </div>
                                                }
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </section>
                    </div>
                }
            </div>
        </div>
    );
}
