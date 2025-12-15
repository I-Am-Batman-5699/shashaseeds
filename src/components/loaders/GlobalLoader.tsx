"use client";

import { ReactNode } from 'react';
import DoubleHelix from './DoubleHelix';

interface GlobalLoaderProps {
    children: ReactNode;
    isLoading: boolean; 
}

export default function GlobalLoader({ children, isLoading }: GlobalLoaderProps) {
    return (
        <>
            {isLoading && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/10 backdrop-blur-sm"
                    aria-label="Loading page content"
                >
                    <DoubleHelix/>
                </div>
            )}
            {children}
        </>
    );
}