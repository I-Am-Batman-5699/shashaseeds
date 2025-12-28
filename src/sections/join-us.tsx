"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FetchItems } from "@/lib/fetcher";
import { JoinUSProps } from "@/types/components/sections/join-us";

export default function JoinUsSection() {

    const [joinUsContent, setJoinUsContent] = useState<JoinUSProps>();
    const [joinUsContentLoading, setJoinUsContentLoading] = useState(true);

    const fetchItems = async () => {
        const response = await FetchItems({ path: '/models/join-us-content.json' });
        if (response.status === "S" && response.data) {
            setJoinUsContent(transformItemsData(response.data));
        }
        else if (response.status === "E") {
            console.error(response.error);
        }
        else {
            console.error("Unknown error occurred while fetching hero content");
        }
        setJoinUsContentLoading(false);
    }

    const transformItemsData = (item: unknown) => {
        return item as JoinUSProps;
    }

    useEffect(() => {
        fetchItems();
        setJoinUsContentLoading(true);
    }, []);

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="max-w-[95%] mx-auto md:pb-8 pb-4 md:pt-4 pt-1">
                {
                    joinUsContentLoading &&
                    <div className="flex items-center justify-center flex-row align-middle rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm dark:inset-shadow-indigo-900/50 space-y-1">
                        <div>
                            <p className="text-gray-700">Fetching latest updates...</p>
                        </div>
                    </div>
                }
                {joinUsContent && joinUsContentLoading === false &&
                    <div className={`rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm dark:inset-shadow-indigo-900/50 space-y-1`}>
                        <section className={`relative overflow-hidden w-full`}>
                            <div className="relative mx-auto max-w-7xl px-6 lg:py-16 md:py-10 py-6 flex flex-col justify-center items-center align-middle lg:px-12 text-zinc-950/90">
                                <p className="md:text-4xl lg:text-5xl sm:text-xl font-bold  mb-2 text-green-900">
                                    {joinUsContent.title}
                                </p>
                                <p className="md:text-xl lg:text-3xl sm:text-md text-sm my-4 leading-relaxed text-center">
                                    {joinUsContent.description}
                                </p>
                                <div className="flex items-center justify-center align-middle gap-4">
                                    {joinUsContent.actions && joinUsContent.actions.map((el, i) => (
                                        <a key={i + "actionaJoinUs"} className={`${el.cssClass}`} href={el.href}>
                                            {el.label}
                                        </a>
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
