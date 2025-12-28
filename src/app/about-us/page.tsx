"use client";
import React, { useEffect, useRef, useState, useCallback, useContext, createContext, Dispatch, SetStateAction } from "react";
import { useSearchParams } from "next/navigation";
import DynamicIcon, { IconName } from "../../components/ui/dynamicIcon";
import { Company, CompanyInfo } from "@/types/company";
import { FetchItems } from "@/lib/fetcher";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";
import company from "@/data/company.json";
import { AboutUsPageSection, FeatureToggleProps } from "@/types/featureToggle";
import AIDNALoader from "@/components/loaders/ClosedAIDNA";
import { AboutUs } from "@/types/aboutUs";

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
            { threshold: 0.1 }
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

const HolographicProfile = ({ appContext }: { appContext: AboutUs }) => (
    <div className="relative w-full max-w-md mx-auto p-4 md:p-8 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl dark:shadow-black/50 mt-2 mb-2">

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <ScrollFadeIn direction="down" delay={200} id="owner-profile-image">
                <div className="relative w-32 h-32 rounded-full p-1 bg-accent/30 flex items-center justify-center animate-spin-slow">
                    <img
                        src={appContext?.owner.image}
                        alt={appContext?.owner.name}
                        className="w-full h-full object-cover rounded-full border-4 border-primary-bg"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150/065F46/D1FAE5?text=Owner+Profile')}
                    />
                </div>
            </ScrollFadeIn>

            <ScrollFadeIn direction="left" delay={500} className="w-full" id="owner-profile-name">
                <p className="sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-primary-text tracking-wider mt-1">
                    {appContext?.owner.name}
                </p>
                <p className="sm:text-sm md:text-md lg:text-lg font-medium text-cyber italic">
                    {appContext?.owner.title}
                </p>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={800} className="w-full" id="owner-profile-bio">
                <p className="text-secondary-text leading-relaxed mt-2 sm:text-xs md:text-sm">
                    <span className="text-accent font-semibold">BIO-LOG:</span> {appContext?.owner.bio}
                </p>
            </ScrollFadeIn>

            <ScrollFadeIn direction="up" delay={1100} className="w-full" id="owner-profile-vision">
                <div className="mt-1 pt-1 w-full text-left">
                    <p className="sm:text-xs md:text-sm font-bold text-accent mb-2 uppercase tracking-widest">Digital Credentials</p>
                    <ul className="space-y-1 sm:text-xs md:text-sm text-secondary-text">
                        {appContext?.owner.credentials.map((cred, i) => (
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

export default function AboutUsFuturistic() {

    const [companyData, setCompanyData] = useState<CompanyInfo>();
    const [companyDataLoading, setCompanyDataLoading] = useState(true);

    const [featuresVisible, setFeaturesVisible] = useState<AboutUsPageSection>();
    const [featuresLoading, setFeaturesLoading] = useState(true);

    const [appContext, setAppContext] = useState<AboutUs>();
    const [appContextLoading, setAppContextLoading] = useState(true);

    const searchParams = useSearchParams();

    const fetchItems = async (path: string, setContent: Dispatch<SetStateAction<any>>, modelName?: string, setLoading?: (flag: boolean) => void) => {
        const response = await FetchItems({ path: path });
        if (response.status === "S" && response.data) {
            if (modelName === "feature") {
                setContent(((response.data as FeatureToggleProps)["about-us-page"].sections));
            }
            else if (modelName === "about-us") {
                setContent(response.data as AboutUs);
            }
        }
        else if (response.status === "E") {
            console.error(response.error);
        }
        else {
            console.error("Unknown error occurred while fetching company content");
        }
        if (setLoading) {
            setLoading(false);
        }
    }

    const fetchFetures = () => {
        fetchItems("/models/feature/feature-toggle.json", setFeaturesVisible, "feature", setFeaturesLoading);
    }
    const fetchAbouUs = () => {
        fetchItems("/models/about-us.json", setAppContext, "about-us", setAppContextLoading);
    }

    useEffect(() => {
        fetchFetures();
        fetchAbouUs();
        setCompanyData(company.companyInfo);
        setCompanyDataLoading(false);
        setTimeout(() => {
            const sectionFromURL = searchParams.get('section');
            if (sectionFromURL) {
                scrollTo(sectionFromURL);
            }
        }, 1000)
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50">
            {
                featuresLoading ? <AIDNALoader /> : (
                    <div className="mx-auto mt-2 lg:max-w-[90%] w-full sticky top-18 z-[69] flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-theme backdrop-blur-md shadow-lg bg-gradient-to-br from-green-50/50 to-green-100/50 text-zinc-800 dark:from-slate-900/50 dark:to-slate-950/50">
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
                )
            }

            <div className="mx-auto lg:max-w-[90%] md:max-w-7xl md:pb-8 pb-4 md:pt-4 pt-1 flex-1 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">

                    {/* --- Section 1. HEADER & MISSION STATEMENT (Scroll Fade Up) --- */}
                    {!featuresVisible?.showMission ? null :
                        companyDataLoading ? <HelixHorizontal /> :
                            (
                                <ScrollFadeIn direction="up" id="header-mission">
                                    <header className={`py-8 text-center mt-2`}>
                                        <p className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-accent drop-shadow-lg">
                                            {companyData?.name}
                                        </p>
                                        <p className="text-lg md:text-xl font-sans mt-3">
                                            {companyData?.tagline}
                                        </p>
                                        <div className="max-w-4xl mx-auto mt-6 p-4 rounded-lg border border-reverse-theme bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950">
                                            <p className="sm:text-xl md:text-2xl font-bold text-cyan-400 mb-3 tracking-wider">
                                                {appContext?.mission.title}
                                            </p>
                                            <p className="sm:text-md md:text-lg text-secondary-text font-mono leading-relaxed">
                                                {appContext?.mission.description}
                                            </p>
                                        </div>
                                    </header>
                                </ScrollFadeIn>
                            )}

                    {/* --- SECTION 2: OUR STORY --- */}
                    {!featuresVisible?.showStory ? null : (

                        <ScrollFadeIn id="our-story" scrollMarginClass="scroll-mt-40" direction="up">
                            <section>
                                <div className="flex items-center space-x-4 mb-8">
                                    <p className="text-3xl md:text-4xl font-black tracking-tighter italic">
                                        <span className="text-heading">Our Story</span>
                                    </p>
                                </div>
                                {appContextLoading ? <HelixHorizontal /> : (
                                    <div className="grid md:grid-cols-2 gap-12 items-center">
                                        <ScrollFadeIn key={"our-story-content"} direction="left" delay={200} className="h-full">
                                            <div className="p-8 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border-l-4 border-accent shadow-xl rounded-r-2xl">
                                                <p className="sm:text-lg md:text-xl font-bold text-cyber mb-4">{appContext?.story.title}</p>
                                                <p className="text-secondary-text leading-relaxed font-mono text-sm">
                                                    {appContext?.story.content}
                                                </p>
                                            </div>
                                        </ScrollFadeIn>
                                        <div className="space-y-4">
                                            {appContext?.story.milestones.map((m, i) => (
                                                <ScrollFadeIn key={m + "" + i} direction="left" delay={i * 200 + 400} className="h-full">
                                                    <div key={i} className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 rounded-lg border border-theme">

                                                        <div className="w-2 h-2 rounded-full bg-cyber animate-ping" />
                                                        <span className="text-xs font-bold tracking-widest">{m}</span>
                                                    </div>
                                                </ScrollFadeIn>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        </ScrollFadeIn>
                    )}

                    {/* --- SECTION 3: MISSION & VISION --- */}
                    {!featuresVisible?.showMissionVision ? null : (
                        <ScrollFadeIn id="our-mission" delay={100} scrollMarginClass="scroll-mt-40">
                            <div className="flex items-center space-x-4 mb-8">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter italic">
                                    <span className="text-heading">Our Mission and Vision</span>
                                </p>
                            </div>
                            {appContextLoading ? <HelixHorizontal /> : (
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
                                            {appContext?.missionVision.mission.text}
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
                                            {appContext?.missionVision.vision.text}
                                        </p>
                                        <div className="mt-8 h-1 w-20 bg-cyber" />
                                    </div>
                                </section>
                            )}
                        </ScrollFadeIn>
                    )}

                    {/* --- 4. CORE PROTOCOLS (BENEFITS) --- */}
                    {!featuresVisible?.showBenefits ? null : (
                        <ScrollFadeIn direction="up" delay={200} id="core-portocols">
                            <section className="text-center pt-6">
                                <p className="text-3xl md:text-4xl font-extrabold mb-5 inline-block pb-2 uppercase text-heading">
                                    <span className="text-accent animate-pulse">→</span> CORE PROTOCOLS <span className="text-accent animate-pulse">←</span>
                                </p>
                                {appContextLoading ? <HelixHorizontal /> : (
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {appContext?.benefits.map((benefit, index) => (
                                            <ScrollFadeIn key={benefit.id} direction="up" delay={index * 200 + 400} className="h-full">
                                                <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 h-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:border-cyber/80`}>
                                                    <DynamicIcon name={benefit.icon as IconName} className="w-10 h-10 mx-auto text-accent mb-4 animate-pulse-slow" />
                                                    <p className="sm:text-lg md:text-xl font-bold text-secondary-heading mb-3">{benefit.title}</p>
                                                    <p className="text-secondary-text text-sm">{benefit.description}</p>
                                                </div>
                                            </ScrollFadeIn>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </ScrollFadeIn>
                    )}

                    {/* --- 5. FOUNDER PROFILE (ANIMATED/HOLOGRAPHIC) --- */}
                    {!featuresVisible?.showFounderProfile ? null : (
                        <section className="py-2">
                            <ScrollFadeIn direction="right" delay={300} id="founder-profile">
                                <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-heading mb-2 text-center pb-2 justify-center flex">
                                    Meet the Founder and Owner
                                </p>
                                {appContextLoading ? <HelixHorizontal /> : (
                                    <HolographicProfile appContext={appContext as AboutUs} />
                                )}
                            </ScrollFadeIn>
                        </section>
                    )}

                    {/* --- 6. VALIDATED PEER REPORTS (TESTIMONIALS) --- */}
                    {!featuresVisible?.showTestimonials ? null : (
                        <section className="py-2">
                            <ScrollFadeIn direction="left" delay={300} id="peer-reports" scrollMarginClass="scroll-mt-40">
                                <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-extrabold text-heading mb-2 text-center inline-block pb-2">
                                    Validated Pier Reports
                                </p>
                                {appContextLoading ? <HelixHorizontal /> : (
                                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                                        {appContext?.testimonials.map((testimonial, index) => (
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
                                )}
                            </ScrollFadeIn>
                        </section>
                    )}

                    {/* --- SECTION 7: OUR TEAM --- */}
                    {!featuresVisible?.showTeam ? null : (
                        <section className="py-2">
                            <ScrollFadeIn delay={100} scrollMarginClass="scroll-mt-40" id="our-team">
                                <div className="text-center mb-8">
                                    <DynamicIcon name="users" className="w-12 h-12 text-accent mx-auto mb-4" />
                                    <p className="sm:text-xl m-2 md:text-3xl lg:text-4xl font-black tracking-widest text-heading">
                                        Shashank's Team
                                    </p>
                                    <p className="sm:text-md md:text-lg lg:text-xl text-secondary-text mt-2 font-mono">Biological Data Orchestrators</p>
                                </div>
                                {appContextLoading ? <HelixHorizontal /> : (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        {appContext?.team.map((member, i) => (
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
                                )}
                            </ScrollFadeIn>
                        </section>
                    )}

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
                                Contact Technical Oversight at {companyData?.email}
                            </p>
                        </div>
                    </ScrollFadeIn>

                </div>
            </div>

        </div >
    );
}