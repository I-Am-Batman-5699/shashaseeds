// components/ImageCard.tsx
"use client"; // This component will handle rendering and potentially interactivity

import Image from 'next/image';
import type { FC } from 'react';

// Define the props interface for the ImageCard component
interface ImageCardProps {
    imageUrl: string;
    altText: string;
    title: string;
    loading?: 'lazy' | 'eager';
}

const ImageCard: FC<ImageCardProps> = ({ imageUrl, altText, title, loading='lazy' }) => {
    return (
        <div className="max-w-xl mx-auto rounded-lg overflow-hidden shadow-xl flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 text-white pt-10 ">
            <div className="h-auto w-auto">
                <div
                    className="w-[70px] relative top-2 left-0 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-sm z-10 items-center justify-center flex"
                    style={{ transform: "rotate(-45deg) translate(-25px, 25px)" }}
                >
                    <div className="absolute inset-0 rounded-sm border-2 border-slate-200 animate-pulse opacity-50"></div>
                    Featured
                </div>
                <Image
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-cover"
                    width={200}
                    height={190}
                    loading={loading}
                />
            </div>
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <div className="bg-black bg-opacity-50"></div>
                <div className="z-10 text-white max-w-2xl">
                    <h2 className="text-base sm:text-lg opacity-90">
                        {title}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;