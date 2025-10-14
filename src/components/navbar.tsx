"use client";
import type { FC } from 'react';

interface HeaderProps {
    siteTitle?: string;
}

const Header: FC<HeaderProps> = ({ siteTitle = "Shashank Seeds" }) => {
    return (
        <header className="p-4 shadow-lg">
            <nav className="container mx-auto flex justify-center items-center">
                <h2 className="sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-white hover:text-green-600 transition duration-300 cursor-pointer">
                    {siteTitle}
                </h2>
            </nav>

            <div className="flex justify-center items-center pt-2 pb-1 sm:pt-3">
                <h2 className="sm:text-lg md:text-xl lg:text-2xl  font-semibold leading-tight bg-gradient-to-r from-yellow-600 via-green-600 to-green-700 text-transparent bg-clip-text animate-pulse">
                    Seeds for bountiful harvests
                </h2>
            </div>
        </header>
    );
};

export default Header;