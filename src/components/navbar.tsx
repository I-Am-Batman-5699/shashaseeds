"use client";
import type { FC } from 'react';

// Define prop types for the Header component
interface HeaderProps {
    siteTitle?: string; // Optional site title
}

// const img = "ml-2 border-teal bg-transparent flex";
// const MyLogo: FC = () => (
//     <Avatar alt="Instagram" src="/shashank_logo.png" variant="square" className={`mt-0.5 ${img}`} style={{ width: '1.25rem', height: '1.25rem' }} />
// );

const Header: FC<HeaderProps> = ({ siteTitle = "Shashank Seeds" }) => {
    return (
        <header className="p-4 shadow-md">
            <nav className="container mx-auto flex justify-center items-center">
                <h2 className="text-6xl sm:text-4xl font-bold hover:text-gray-300 disabled:true">
                    {siteTitle}
                </h2>
            </nav>
            <div className="flex justify-center items-center mt-2">
                <h2 className="text-m sm:text-m font-bold mb-2 sm:mb-4 leading-tight bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-transparent bg-clip-text animate-pulse">
                    Seeds for bountiful harvests
                </h2>
            </div>
        </header>
    );
};

export default Header;