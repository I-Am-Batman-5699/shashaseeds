"use client";

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { NextRouter } from 'next/router';

import Navbar from "@/components/layout/navbar";

interface GlobalLoaderProps {
    children: ReactNode;
}

export default function GlobalLoader({ children }: GlobalLoaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let routerEvents: NextRouter['events'] | undefined;

        const setupRouterEvents = async () => {
            const nextRouter: any = await import('next/router');
            routerEvents = nextRouter.default.events;

            const handleStart = (url: string) => {
                if (url !== pathname) {
                    setIsLoading(true);
                }
            };

            const handleComplete = () => {
                setIsLoading(false);
            };

            if (routerEvents) {
                routerEvents.on('routeChangeStart', handleStart);
                routerEvents.on('routeChangeComplete', handleComplete);
                routerEvents.on('routeChangeError', handleComplete);
            }

            return () => {
                if (routerEvents) {
                    routerEvents.off('routeChangeStart', handleStart);
                    routerEvents.off('routeChangeComplete', handleComplete);
                    routerEvents.off('routeChangeError', handleComplete);
                }
            };
        };

        const cleanupPromise = setupRouterEvents();
        return () => { cleanupPromise.then(cleanup => cleanup()); };
    }, [pathname]);

    return (
        <>
            <div
                className={`
                    bg-gradient-to-br from-green-50 to-green-100 p-0.5
                    ${isLoading ? "**pointer-events-none opacity-50 transition-opacity duration-300**" : ""}
                `}
            >
                <Navbar isLoading={isLoading} />
            </div>
            {children}
        </>
    );
}