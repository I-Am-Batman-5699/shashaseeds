"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { NextRouter } from 'next/router';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import HeaderNavbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GlobalDataProvider } from "@/context/global-data-context";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 overflow-x-hidden`}
            >
                <HeaderNavbar isLoading={isLoading} />

                <GlobalDataProvider>
                    <main className="flex-grow relative">
                        <div>
                            <GlobalLoader isLoading={isLoading}>
                                {children}
                            </GlobalLoader>
                        </div>
                    </main>

                    <Footer />
                </GlobalDataProvider>
            </body>
        </html>
    );
}