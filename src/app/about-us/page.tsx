"use client";
import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback, useContext, createContext } from "react";
/*  <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-[90vh] flex items-center justify-center">
     <div className="mx-auto max-w-[90vw] md:pb-8 pb-4 md:pt-4 pt-1">
         <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1 min-w-[80vw] flex items-center justify-center min-h-[80vh]">
             <DoubleHelix />
         </div>
     </div>
 </div> */

// --- 0. Icon Replacements (Mocking Lucide Icons with SVG) ---
// Note: LeafIcon is kept for a potential logo/header usage, others were removed as they were only used in the removed Footer.
const LeafIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 17 2c0 2.2-2.3 2.8-5 2.8s-3.7-.8-5-2.8c1.3 2 2.5 3 5 3 2.4 0 4.2-1.7 5-3.8-2.6 1.7-5.5 3.3-8.8 3.5A7 7 0 0 1 11 20z" /></svg>);

// New Icons for Futuristic Page (Kept as they are used in the main component)
const HelixIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20M22 12A14.5 14.5 0 0 1 2 12" /></svg>);
const TargetIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const RecycleIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21v-4M7 21h4M7 21l3.5-3.5M17 3v4M17 3h-4M17 3l-3.5 3.5M21 7l-3.5 3.5M3 17l3.5-3.5M10.5 10.5l-3.5 3.5M13.5 13.5l3.5-3.5" /></svg>);
const QuoteIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 5-2 5-5V7h-3v4H5v5c0 3 2 5 5 5h-7z" /><path d="M15 21c3 0 5-2 5-5V7h-3v4h-2v5c0 3 2 5 5 5h-7z" /></svg>);


// --- MOCK DATA (Streamlined) ---
const APP_CONTEXT = {
    appData: {
        copy: "© 2025 Shashank Seeds. All rights reserved. | Bio-Code V2.5.1",
        appName: "Shashank Seeds",
        slogan: "Seeds for a Bountiful Harvest: Engineered for the Future",
        url: "/shashank_logo.png",
        email: "shashankseeds@gmail.com",
    }
};

// Removed COMPANY_DATA and UI_ELEMENTS as they were only used in the removed Footer.

const ABOUT_US_DATA = {
    owner: {
        name: "Shashank Sharma",
        title: "Founder & Chief Genomic Officer (CGO)",
        bio: "Visionary architect of Shashank Seeds. Dedicated to synthesizing ecological sustainability with advanced genomic data streams to create climate-resilient cultivars.",
        image: "https://placehold.co/150x150/065F46/D1FAE5?text=Owner+Profile",
        credentials: ["AI-Driven Agriculture Certified", "Sustainable Bio-Engineering PhD", "Patent: Hyper-Adaptive Seed Coating"],
        vision: "To cultivate a future where every seed holds the maximum potential for global nourishment and environmental regeneration."
    },
    benefits: [
        { id: 1, title: "Genomic Resilience", icon: HelixIcon, description: "Utilizing deep learning models to screen and enhance seed DNA against 21st-century climate variability." },
        { id: 2, title: "Precision Cultivation Protocols", icon: TargetIcon, description: "Our seeds are pre-calibrated for maximum yield with minimal resource expenditure, guided by predictive analytics." },
        { id: 3, title: "Sustainable Synthesis", icon: RecycleIcon, description: "Closed-loop breeding cycles ensure ecological balance, reducing environmental impact by 85% compared to traditional farming." }
    ],
    testimonials: [
        { id: 1, user: "Dr. Alok V.", title: "Groundbreaking Yields", content: "The 'Astro-Corn' line delivered a 40% yield increase in arid conditions. This isn't farming; it's bio-engineering excellence.", source: "Research Institute of Uttar Pradesh" },
        { id: 2, user: "Priya S.", title: "Future of Farming", content: "The seed-to-harvest data provided was invaluable. It felt like planting success before the seed even hit the soil.", source: "Agri-Tech Startup CEO" },
        { id: 3, user: "Rajesh K.", title: "Ethical & Efficient", content: "Shashank Seeds provides unmatched genetic purity and ethical sourcing. A critical partner for large-scale sustainable projects.", source: "Global NGO Director" }
    ],
    mission: {
        title: "The Synthesis: Nurturing Nature, Driven by Data",
        description: "Shashank Seeds operates at the intersection of genetic science and sustainable ecology. We are not just selling seeds; we are deploying bio-coded solutions. Our mission is to secure global food systems by engineering hyper-efficient, resilient plant life using proprietary AI-driven genomic mapping.",
    }
};


// --- 1. THEME DEFINITIONS & CONTEXT SETUP ---

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    currentMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// --- 2. THEME PROVIDER LOGIC ---

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Initialize theme from localStorage or default to 'system'
    const [theme, setTheme] = useState<ThemeMode>(() => {
        try {
            const storedTheme = localStorage.getItem('app-theme') as ThemeMode;
            return storedTheme || 'system';
        } catch (error) {
            return 'system';
        }
    });

    // 2. State for the *actual* determined mode ('light' or 'dark')
    const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');

    // Function to determine the actual mode based on state and system preference
    const calculateMode = useCallback((currentTheme: ThemeMode) => {
        if (currentTheme === 'light') return 'light';
        if (currentTheme === 'dark') return 'dark';

        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    // 3. Effect to update currentMode and set up system listener
    useEffect(() => {
        // Save theme setting to localStorage
        localStorage.setItem('app-theme', theme);

        const initialMode = calculateMode(theme);
        setCurrentMode(initialMode);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                setCurrentMode(e.matches ? 'dark' : 'light');
            }
        };

        // Listen for system changes only if theme is 'system'
        if (theme === 'system') {
            mediaQuery.addEventListener('change', handler);
        }

        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, [theme, calculateMode]);

    // Update currentMode immediately when the theme prop changes (e.g., user switches from 'system' to 'dark')
    useEffect(() => {
        setCurrentMode(calculateMode(theme));
    }, [theme, calculateMode]);


    // 4. Provider Value
    const value = { theme, setTheme, currentMode };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};


// --- 3. CUSTOM CSS AND THEME CLASS INJECTION ---

// This component acts as the root wrapper to apply global styles and theme classes.
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const { currentMode } = useTheme();

    // Define the base theme classes based on the current mode
    const baseThemeClasses = currentMode === 'dark'
        ? 'bg-gray-900 text-white transition-colors duration-500'
        : 'bg-green-50 text-gray-900 transition-colors duration-500';

    // The glowing container class uses variables defined in the style block.
    // We add 'cyber-glow' only in dark mode
    const glowingContainerClass = `glowingContainer ${baseThemeClasses} ${currentMode === 'dark' ? 'cyber-glow' : ''}`;

    return (
        <>
            {/* Global Styles (Integrating custom CSS and variables) */}

            {/* Main Application Container with dynamic theme class */}
            <div className={`app-container theme-${currentMode} ${glowingContainerClass}`}>
                {children}
            </div>
        </>
    );
};


// --- Reusable Scroll-Reveal Component ---

const ScrollFadeIn = ({ children, direction = 'up', delay = 0, className = '' }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right' | 'down', delay?: number, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the item is visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const baseTransition = `transition-all duration-1000 ease-out ${className}`;
    let transformClasses = 'opacity-0';

    if (direction === 'up') {
        transformClasses += ' translate-y-8';
    } else if (direction === 'left') {
        transformClasses += ' -translate-x-8';
    } else if (direction === 'right') {
        transformClasses += ' translate-x-8';
    } else if (direction === 'down') {
        transformClasses += ' -translate-y-8';
    }

    const visibleClasses = 'opacity-100 translate-y-0 translate-x-0';

    return (
        <div
            ref={ref}
            className={`${baseTransition} ${isVisible ? visibleClasses : transformClasses} rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 dark:inset-shadow-indigo-900/50`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- Main Futuristic About Us Component ---

export default function AboutUsFuturistic() {
    // const { currentMode } = useTheme(); 
    const isDark = false;

    // --- Holographic Profile Component ---
    const HolographicProfile = () => (
        <div className="relative w-full max-w-md mx-auto p-4 md:p-8 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl dark:shadow-black/50 mt-2 mb-2">
            {/* Holographic Scan Effect (only visible in Dark Mode for stronger effect) */}
            {isDark && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-base-bg data-grid animate-[dataFlow_10s_linear_infinite]"></div>
                    <div className="absolute inset-x-0 top-0 h-1 blur-sm bg-cyber animate-pulse"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 blur-sm bg-accent animate-pulse"></div>
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <ScrollFadeIn direction="down" delay={200} >
                    <div className="relative w-32 h-32 rounded-full p-1 bg-accent/30 flex items-center justify-center animate-spin-slow">
                        <img
                            src={ABOUT_US_DATA.owner.image}
                            alt={ABOUT_US_DATA.owner.name}
                            className="w-full h-full object-cover rounded-full border-4 border-primary-bg"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150/065F46/D1FAE5?text=Owner+Profile')}
                        />
                    </div>
                </ScrollFadeIn>

                <ScrollFadeIn direction="left" delay={500} className="w-full">
                    <p className="sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-primary-text tracking-wider mt-1">
                        {ABOUT_US_DATA.owner.name}
                    </p>
                    <p className="sm:text-sm md:text-md lg:text-lg font-medium text-cyber italic">
                        {ABOUT_US_DATA.owner.title}
                    </p>
                </ScrollFadeIn>

                <ScrollFadeIn direction="right" delay={800} className="w-full">
                    <p className="text-secondary-text leading-relaxed mt-2 sm:text-xs md:text-sm">
                        <span className="text-accent font-semibold">BIO-LOG:</span> {ABOUT_US_DATA.owner.bio}
                    </p>
                </ScrollFadeIn>

                <ScrollFadeIn direction="up" delay={1100} className="w-full">
                    <div className="mt-1 pt-1 w-full text-left">
                        <p className="sm:text-xs md:text-sm font-bold text-accent mb-2 uppercase tracking-widest">Digital Credentials</p>
                        <ul className="space-y-1 sm:text-xs md:text-sm text-secondary-text">
                            {ABOUT_US_DATA.owner.credentials.map((cred, i) => (
                                <li key={i} className="flex items-center">
                                    <span className="text-cyber mr-2 sm:text-xs md:text-sm leading-none">&raquo;</span>
                                    {cred}
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScrollFadeIn>
            </div>
        </div>
    );
    // --- End Holographic Profile Component ---


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50">
            <div className="mx-auto lg:max-w-[90%] md:max-w-7xl md:pb-8 pb-4 md:pt-4 pt-1 flex-1 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* --- 1. HEADER & MISSION STATEMENT (Scroll Fade Up) --- */}
                    <ScrollFadeIn direction="up">
                        <header className={`py-8 text-center mt-2`}>
                            <p className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-accent drop-shadow-lg">
                                {APP_CONTEXT.appData.appName}
                            </p>
                            <p className="text-lg md:text-xl font-sans mt-3">
                                {APP_CONTEXT.appData.slogan}
                            </p>
                            <div className="max-w-4xl mx-auto mt-6 p-4 rounded-lg border border-reverse-theme bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950">
                                <p className="sm:text-xl md:text-2xl font-bold text-cyan-400 mb-3 tracking-wider">
                                    {ABOUT_US_DATA.mission.title}
                                </p>
                                <p className="sm:text-md md:text-lg text-secondary-text font-mono leading-relaxed">
                                    {ABOUT_US_DATA.mission.description}
                                </p>
                            </div>
                        </header>
                    </ScrollFadeIn>

                    {/* --- 2. CORE PROTOCOLS (BENEFITS) --- */}
                    <ScrollFadeIn direction="up" delay={200}>
                        <section className="text-center pt-6">
                            <p className="text-3xl md:text-4xl font-extrabold mb-5 inline-block pb-2 uppercase text-heading">
                                <span className="text-accent animate-pulse">→</span> CORE PROTOCOLS <span className="text-accent animate-pulse">←</span>
                            </p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {ABOUT_US_DATA.benefits.map((benefit, index) => (
                                    <ScrollFadeIn key={benefit.id} direction="up" delay={index * 200 + 400} className="h-full">
                                        <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 h-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:border-cyber/80`}>
                                            <benefit.icon className="w-10 h-10 mx-auto text-accent mb-4 animate-pulse-slow" />
                                            <p className="sm:text-lg md:text-xl font-bold text-secondary-heading mb-3">{benefit.title}</p>
                                            <p className="text-secondary-text text-sm">{benefit.description}</p>
                                        </div>
                                    </ScrollFadeIn>
                                ))}
                            </div>
                        </section>
                    </ScrollFadeIn>

                    {/* --- 3. FOUNDER PROFILE (ANIMATED/HOLOGRAPHIC) --- */}
                    <section className="py-2">
                        <ScrollFadeIn direction="right" delay={300}>
                            <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-primary-text mb-2 text-center inline-block pb-2">
                                Founder and Owner's profile
                            </p>
                            <HolographicProfile />
                        </ScrollFadeIn>
                    </section>

                    {/* --- 4. VALIDATED PEER REPORTS (TESTIMONIALS) --- */}
                    <section className="py-2">
                        <ScrollFadeIn direction="left" delay={300}>
                            <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-primary-text mb-2 text-center inline-block pb-2">
                                Validated Pier Reports
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                                {ABOUT_US_DATA.testimonials.map((testimonial, index) => (
                                    <ScrollFadeIn key={testimonial.id} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 200 + 300} className="h-full">
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 shadow-inner border-l-4 border-cyber h-full flex flex-col justify-between">
                                            <QuoteIcon className="w-8 h-8 text-accent mb-4 opacity-50" />
                                            <p className="text-primary-text italic sm:text-md md:text-lg leading-relaxed mb-4">
                                                "{testimonial.content}"
                                            </p>
                                            <div className="flex flex-col text-right">
                                                <p className="font-bold text-cyber sm:text-md md:text-lg">{testimonial.title}</p>
                                                <p className="sm:text-sm md:text-md font-medium text-accent">— {testimonial.user}</p>
                                                <p className="sm:text-xs md:text-sm text-secondary-text mt-1 uppercase tracking-wider">{testimonial.source}</p>
                                            </div>
                                        </div>
                                    </ScrollFadeIn>
                                ))}
                            </div>
                        </ScrollFadeIn>
                    </section>

                    {/* --- 5. COMPLIANCE & DATA MESSAGE --- */}
                    <ScrollFadeIn direction="up" delay={300}>
                        <div className="text-center p-8 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 rounded-xl shadow-inner border border-theme">
                            <p className="sm:text-md md:text-lg lg:text-xl font-semibold text-primary-text">
                                <span className="text-cyber">[</span> SYSTEM STATUS: <span className="text-accent">OPTIMAL</span> <span className="text-cyber">]</span>
                            </p>
                            <p className="sm:text-xs md:text-sm lg:text-md text-secondary-text mt-2 font-mono">
                                All data streams are compliant and protected under Protocol 7-Beta. Your trust is genetically guaranteed.
                            </p>
                            <p className="sm:text-xs lg:text-sm text-accent mt-1">
                                Contact Technical Oversight at {APP_CONTEXT.appData.email}
                            </p>
                        </div>
                    </ScrollFadeIn>

                </div>
            </div>

        </div >
    );
}

// --- 4. THEME SELECTOR UI (for demonstration) ---
const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();

    const themes: { mode: ThemeMode, label: string }[] = [
        { mode: 'light', label: 'Light' },
        { mode: 'dark', label: 'Dark' },
        { mode: 'system', label: 'System' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-0 pt-4 pb-2">
            <div className="flex items-center space-x-3 bg-primary-bg p-3 rounded-xl border border-theme shadow-theme mb-4">
                <span className="text-sm font-semibold text-primary-text">Select Theme:</span>
                {themes.map(({ mode, label }) => (
                    <button
                        key={mode}
                        onClick={() => setTheme(mode)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors 
                            ${theme === mode
                                ? 'bg-accent text-white shadow-md'
                                : 'bg-secondary-bg text-secondary-text hover:bg-gray-400/50'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// // --- 5. ROOT APPLICATION COMPONENT ---
// // This is the exported component that initializes the theme system.
// export default function App() {
//     return (
//         <ThemeProvider>
//             <ThemeWrapper>
//                 <AboutUsFuturistic />
//             </ThemeWrapper>
//         </ThemeProvider>
//     );
// }