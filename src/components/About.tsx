"use client";

import React, { useEffect, useState } from 'react';

interface AppData {
    appDescription: string;
    ownerName: string;
    ownerTitle: string;
    companyHistory: string;
    pageTitle: string;
}

const mockAppData: AppData = { 
    pageTitle: "Our Story and Mission",
    appDescription: "Shashank Seeds is dedicated to empowering farmers with high-quality, scientifically-backed seeds. Our mission is to enhance crop yield, promote sustainable farming practices, and contribute to agricultural prosperity across the nation. We blend traditional farming wisdom with modern genetic research to deliver products that perform exceptionally well in diverse climates.",
    ownerName: "K. S. Choudhary",
    ownerTitle: "Owner & Director",
    companyHistory: "Shashank Seeds is a family-owned business. Our founder, K. S. Choudhary, has dedicated his life to providing high-quality seeds to farmers across India. His passion for agriculture and commitment to excellence have been the driving force behind our success."
};

const AboutUs: React.FC = () => {
    const [appData] = useState<AppData>(mockAppData); 
    const [isLoading, setIsLoading] = useState(true);

    const getContent = () => {
        return mockAppData;
    };
    
    const fetchData = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        setIsLoading(false);
        getContent(); 
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const data = appData; 

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-xl text-gray-600">
                Loading About Us content...
            </div>
        );
    }
    
    return (
        <div className="">
            <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <h1 className="text-3xl font-bold text-white py-6 text-center">
                            {data.pageTitle} 
                        </h1>
                        <div className="p-6 sm:p-8 border-t border-b border-green-200 bg-green-50 mb-2 rounded-sm">
                            <h2 className="text-2xl font-bold mb-4 text-green-700">
                                Our Mission
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                                {data.appDescription}
                            </p>
                        </div>
                        <div className="p-6 sm:p-8 border-t border-b border-green-200 bg-green-50 rounded-sm">
                            <h3 className="text-2xl font-bold mb-3 text-green-700">
                                Meet the Owner
                            </h3>
                            <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-800">
                                {data.ownerTitle}: <span className="font-black text-green-800">{data.ownerName}</span>
                            </p>
                            <p className="text-base leading-relaxed text-gray-700">
                                {data.companyHistory}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;