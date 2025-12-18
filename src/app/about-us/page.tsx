"use client";
import React, { useEffect, useRef, useState, useCallback, useContext, createContext } from "react";
import DynamicIcon, {IconName} from "../../components/ui/dynamicIcon";

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
        image: "/shashank_logo.png",
        credentials: ["AI-Driven Agriculture Certified", "Sustainable Bio-Engineering PhD", "Patent: Hyper-Adaptive Seed Coating"],
        vision: "To cultivate a future where every seed holds the maximum potential for global nourishment and environmental regeneration."
    },
    benefits: [
        { id: 1, title: "Genomic Resilience", icon: "helix", description: "Utilizing deep learning models to screen and enhance seed DNA against 21st-century climate variability." },
        { id: 2, title: "Precision Cultivation Protocols", icon: "target", description: "Our seeds are pre-calibrated for maximum yield with minimal resource expenditure, guided by predictive analytics." },
        { id: 3, title: "Sustainable Synthesis", icon: "recycle", description: "Closed-loop breeding cycles ensure ecological balance, reducing environmental impact by 85% compared to traditional farming." }
    ],
    testimonials: [
        { id: 1, user: "Dr. Alok V.", title: "Groundbreaking Yields", content: "The 'Astro-Corn' line delivered a 40% yield increase in arid conditions. This isn't farming; it's bio-engineering excellence.", source: "Research Institute of Uttar Pradesh" },
        { id: 2, user: "Priya S.", title: "Future of Farming", content: "The seed-to-harvest data provided was invaluable. It felt like planting success before the seed even hit the soil.", source: "Agri-Tech Startup CEO" },
        { id: 3, user: "Rajesh K.", title: "Ethical & Efficient", content: "Shashank Seeds provides unmatched genetic purity and ethical sourcing. A critical partner for large-scale sustainable projects.", source: "Global NGO Director" }
    ],
    mission: {
        title: "The Synthesis: Nurturing Nature, Driven by Data",
        description: "Shashank Seeds operates at the intersection of genetic science and sustainable ecology. We are not just selling seeds; we are deploying bio-coded solutions. Our mission is to secure global food systems by engineering hyper-efficient, resilient plant life using proprietary AI-driven genomic mapping.",
    },
    story: {
        title: "Chronicle of Genesis",
        content: "Born in the high-altitude labs of 2022, Shashank Seeds began as a radical experiment in data-driven botany. We realized that traditional farming reached its ceiling; the future required a leap into bio-digital synthesis. From a single workstation to a global leader in genomic agriculture, our story is one of relentless iteration and environmental devotion.",
        milestones: ["2022: Initial Genomic Mapping established", "2023: First Climate-Proof cultivar harvest", "2024: Launch of Bio-Code V2.0"]
    },
    missionVision: {
        mission: {
            title: "Core Mission",
            text: "To optimize global nutrient yields by deploying hyper-efficient, climate-resilient seed technologies through a protocol of precision genetics.",
        },
        vision: {
            title: "Future Vision",
            text: "A world where agricultural scarcity is archived in history, and planetary rejuvenation is powered by the seeds we engineer today.",
        }
    },
    team: [
        { name: "Dr. Elena Vance", role: "Head of Genomic Sequences", image: "https://placehold.co/100x100/06B6D4/FFFFFF?text=EV" },
        { name: "Marcus Thorne", role: "Lead Bio-Architect", image: "https://placehold.co/100x100/10B981/FFFFFF?text=MT" },
        { name: "Sarah J. Miller", role: "Climate Analytics Chief", image: "https://placehold.co/100x100/06B6D4/FFFFFF?text=SM" }
    ]
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

const ScrollFadeIn = ({ children, direction = 'up', delay = 0, className = '', id, scrollMarginClass = "scroll-mt-24" }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right' | 'down', delay?: number, className?: string, id?: string, scrollMarginClass?: string }) => {
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
            id={id}
            ref={ref}
            className={`${baseTransition} ${isVisible ? visibleClasses : transformClasses} ${scrollMarginClass} rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 dark:inset-shadow-indigo-900/50`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
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
                <ScrollFadeIn direction="down" delay={200} id="owner-profile-image">
                    <div className="relative w-32 h-32 rounded-full p-1 bg-accent/30 flex items-center justify-center animate-spin-slow">
                        <img
                            src={ABOUT_US_DATA.owner.image}
                            alt={ABOUT_US_DATA.owner.name}
                            className="w-full h-full object-cover rounded-full border-4 border-primary-bg"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150/065F46/D1FAE5?text=Owner+Profile')}
                        />
                    </div>
                </ScrollFadeIn>

                <ScrollFadeIn direction="left" delay={500} className="w-full" id="owner-profile-name">
                    <p className="sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-primary-text tracking-wider mt-1">
                        {ABOUT_US_DATA.owner.name}
                    </p>
                    <p className="sm:text-sm md:text-md lg:text-lg font-medium text-cyber italic">
                        {ABOUT_US_DATA.owner.title}
                    </p>
                </ScrollFadeIn>

                <ScrollFadeIn direction="right" delay={800} className="w-full" id="owner-profile-bio">
                    <p className="text-secondary-text leading-relaxed mt-2 sm:text-xs md:text-sm">
                        <span className="text-accent font-semibold">BIO-LOG:</span> {ABOUT_US_DATA.owner.bio}
                    </p>
                </ScrollFadeIn>

                <ScrollFadeIn direction="up" delay={1100} className="w-full" id="owner-profile-vision">
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

            <div className="mx-auto mt-2 lg:max-w-[90%] w-full sticky top-18 z-50 flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-theme backdrop-blur-md shadow-lg bg-gradient-to-br from-green-50/50 to-green-100/50 text-zinc-800 dark:from-slate-900/50 dark:to-slate-950/50">
                <nav className="flex items-center space-x-1 sm:space-x-4 sm:flex-row flex-wrap justify-start w-full">
                    <button onClick={() => scrollTo('our-story')} className="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary-text hover:text-accent transition-colors">
                        Story
                    </button>
                    <button onClick={() => scrollTo('our-mission')} className="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary-text hover:text-accent transition-colors">
                        Mission
                    </button>
                    <button onClick={() => scrollTo('peer-reports')} className="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary-text hover:text-accent transition-colors">
                        Peer Reports
                    </button>
                    <button onClick={() => scrollTo('our-team')} className="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary-text hover:text-accent transition-colors">
                        Team
                    </button>
                </nav>
            </div>

            <div className="mx-auto lg:max-w-[90%] md:max-w-7xl md:pb-8 pb-4 md:pt-4 pt-1 flex-1 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">

                    {/* --- 1. HEADER & MISSION STATEMENT (Scroll Fade Up) --- */}
                    <ScrollFadeIn direction="up" id="header-mission">
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

                    {/* --- SECTION 2: OUR STORY --- */}
                    <ScrollFadeIn id="our-story" scrollMarginClass="scroll-mt-36" direction="up">
                        <section>
                            <div className="flex items-center space-x-4 mb-8">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter italic">
                                    <span className="text-heading">Our Story</span>
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <ScrollFadeIn key={"our-story-content"} direction="left" delay={200} className="h-full">
                                    <div className="p-8 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border-l-4 border-accent shadow-xl rounded-r-2xl">
                                        <p className="sm:text-lg md:text-xl font-bold text-cyber mb-4">{ABOUT_US_DATA.story.title}</p>
                                        <p className="text-secondary-text leading-relaxed font-mono text-sm">
                                            {ABOUT_US_DATA.story.content}
                                        </p>
                                    </div>
                                </ScrollFadeIn>
                                <div className="space-y-4">
                                    {ABOUT_US_DATA.story.milestones.map((m, i) => (
                                        <ScrollFadeIn key={m + "" + i} direction="left" delay={i * 200 + 400} className="h-full">
                                            <div key={i} className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 rounded-lg border border-theme">

                                                <div className="w-2 h-2 rounded-full bg-cyber animate-ping" />
                                                <span className="text-xs font-bold tracking-widest">{m}</span>
                                            </div>
                                        </ScrollFadeIn>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollFadeIn>

                    {/* --- SECTION 3: MISSION & VISION --- */}
                    <ScrollFadeIn id="our-mission" delay={100} scrollMarginClass="scroll-mt-36">
                        <div className="flex items-center space-x-4 mb-8">
                            <p className="text-3xl md:text-4xl font-black tracking-tighter italic">
                                <span className="text-heading">Our Mission and Vision</span>
                            </p>
                        </div>
                        <section className="grid md:grid-cols-2 gap-8">
                            {/* Mission */}
                            <div className="p-10 rounded-3xl bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <DynamicIcon name="target" className="w-24 h-24" />
                                </div>
                                <p className="sm:text-xl md:text-2xl lg:text-3xl font-black text-accent mb-6 flex items-center">
                                    <DynamicIcon name="target" className="w-6 h-6 mr-3" /> Mission
                                </p>
                                <p className="sm:text-md md:text-lg text-primary-text font-medium leading-snug">
                                    {ABOUT_US_DATA.missionVision.mission.text}
                                </p>
                                <div className="mt-8 h-1 w-20 bg-accent" />
                            </div>

                            {/* Vision */}
                            <div className="p-10 rounded-3xl bg-gray-900 text-white border border-cyber/50 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <DynamicIcon name="eye" className="w-24 h-24 text-cyber" />
                                </div>
                                <p className="sm:text-xl md:text-2xl lg:text-3xl font-black text-cyber mb-6 flex items-center">
                                    <DynamicIcon name="eye" className="w-6 h-6 mr-3" /> Vision
                                </p>
                                <p className="sm:text-md md:text-lg text-gray-300 font-medium leading-snug">
                                    {ABOUT_US_DATA.missionVision.vision.text}
                                </p>
                                <div className="mt-8 h-1 w-20 bg-cyber" />
                            </div>
                        </section>
                    </ScrollFadeIn>

                    {/* --- 4. CORE PROTOCOLS (BENEFITS) --- */}
                    <ScrollFadeIn direction="up" delay={200} id="core-portocols">
                        <section className="text-center pt-6">
                            <p className="text-3xl md:text-4xl font-extrabold mb-5 inline-block pb-2 uppercase text-heading">
                                <span className="text-accent animate-pulse">→</span> CORE PROTOCOLS <span className="text-accent animate-pulse">←</span>
                            </p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {ABOUT_US_DATA.benefits.map((benefit, index) => (
                                    <ScrollFadeIn key={benefit.id} direction="up" delay={index * 200 + 400} className="h-full">
                                        <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 h-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:border-cyber/80`}>
                                            <DynamicIcon name={benefit.icon as IconName} className="w-10 h-10 mx-auto text-accent mb-4 animate-pulse-slow" />
                                            <p className="sm:text-lg md:text-xl font-bold text-secondary-heading mb-3">{benefit.title}</p>
                                            <p className="text-secondary-text text-sm">{benefit.description}</p>
                                        </div>
                                    </ScrollFadeIn>
                                ))}
                            </div>
                        </section>
                    </ScrollFadeIn>

                    {/* --- 5. FOUNDER PROFILE (ANIMATED/HOLOGRAPHIC) --- */}
                    <section className="py-2">
                        <ScrollFadeIn direction="right" delay={300} id="founder-profile">
                            {/* <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-heading mb-2 text-center inline-block pb-2">
                                Founder and Owner's profile
                            </p> */}
                            <HolographicProfile />
                        </ScrollFadeIn>
                    </section>

                    {/* --- 6. VALIDATED PEER REPORTS (TESTIMONIALS) --- */}
                    <section className="py-2">
                        <ScrollFadeIn direction="left" delay={300} id="peer-reports">
                            <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-heading mb-2 text-center inline-block pb-2">
                                Validated Pier Reports
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                                {ABOUT_US_DATA.testimonials.map((testimonial, index) => (
                                    <ScrollFadeIn key={testimonial.id} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 200 + 300} className="h-full">
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 shadow-inner border-l-4 border-cyber h-full flex flex-col justify-between">
                                            <DynamicIcon name="quote" className="w-8 h-8 text-accent mb-4 opacity-50" />
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

                    {/* --- SECTION 7: OUR TEAM --- */}
                    <ScrollFadeIn delay={100} scrollMarginClass="scroll-mt-36" id="our-team">
                        <section>
                            <div className="text-center mb-8">
                                <DynamicIcon name="users" className="w-12 h-12 text-accent mx-auto mb-4" />
                                <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-black tracking-widest text-heading">
                                    Shashank's Team
                                </p>
                                <p className="sm:text-md md:text-lg lg:text-xl text-secondary-text mt-2 font-mono">Biological Data Orchestrators</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {ABOUT_US_DATA.team.map((member, i) => (
                                    <ScrollFadeIn key={member.name} direction="up" delay={i * 200 + 10} className="h-full">
                                        <div key={i} className="group flex flex-col items-center p-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme rounded-2xl transition-all hover:-translate-y-2 hover:shadow-2xl">
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                                                <img src={member.image} alt={member.name} className="relative w-24 h-24 rounded-full border-2 border-cyber" 
                                                     onError={(e) => (e.currentTarget.src = `https://placehold.co/150x150/065F46/D1FAE5?text=${member.name.split(' ').map(n => n[0].toLocaleUpperCase()).join('')}`)}
                                                />
                                            </div>
                                            <p className="sm:text-lg md:text-xl font-bold text-primary-text">{member.name}</p>
                                            <p className="sm:text-xs  md:text-sm text-accent font-bold uppercase tracking-widest mt-1">{member.role}</p>
                                        </div>
                                    </ScrollFadeIn>
                                ))}
                            </div>
                        </section>
                    </ScrollFadeIn>

                    {/* --- 8. COMPLIANCE & DATA MESSAGE --- */}
                    <ScrollFadeIn direction="up" delay={300} id="compliance-status">
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