"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Sprout,
  Droplets,
  Sun,
  ArrowDown,
  Leaf,
  CloudRain,
  Flower2,
  Sparkles,
  Zap
} from "lucide-react";

/**
 * FEATURE DATA
 */
const FEATURES = [
  {
    id: "roots",
    title: "Neural Root Network",
    desc: "A decentralized architecture that self-heals by rerouting data through the healthiest nodes.",
    icon: <Sprout className="w-6 h-6" />
  },
  {
    id: "compute",
    title: "Photosynthetic Compute",
    desc: "Energy-positive processing that captures ambient light to power background tasks.",
    icon: <Sun className="w-6 h-6" />
  },
  {
    id: "sync",
    title: "Vapor-Sync Protocol",
    desc: "Data is atomized into atmospheric moisture, allowing instant sync across any global biome.",
    icon: <CloudRain className="w-6 h-6" />
  },
  {
    id: "ui",
    title: "Seasonal UI",
    desc: "The interface physically changes color and density based on your local climate and time of day.",
    icon: <Leaf className="w-6 h-6" />
  }
];

/**
 * REALISTIC VINE COMPONENT
 */
const RealisticVine = ({ side = "left", progress, isBlooming }: { side: string, progress: number, isBlooming: boolean }) => {
  const isLeft = side === "left";
  const pathD = isLeft
    ? "M 20 1000 Q 80 800 40 600 T 90 300 T 20 0"
    : "M 180 1000 Q 120 800 160 600 T 110 300 T 180 0";

  const vineColor = isBlooming ? "#f59e0b" : "#065f46";
  const leafColor = isBlooming ? "#fbbf24" : "#10b981";
  const flowerColor = "#fff7ed";
  const centerColor = "#d97706";

  return (
    <svg
      viewBox="0 0 200 1000"
      className={`fixed bottom-0 ${isLeft ? 'left-0' : 'right-0'} h-screen w-[22vw] pointer-events-none overflow-visible z-40`}
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke={vineColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1000"
        strokeDashoffset={1000 - (progress * 1000)}
        className="transition-colors duration-1000 ease-in-out"
      />

      {[0.15, 0.35, 0.55, 0.75, 0.92].map((pos, i) => {
        const opacity = progress > pos ? 1 : 0;
        const scale = progress > pos ? 1 : 0;
        const y = 1000 - (pos * 1000);
        const x = isLeft ? (i % 2 === 0 ? 65 : 35) : (i % 2 === 0 ? 135 : 165);

        return (
          <g key={i} style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', opacity, transform: `scale(${scale})`, transformOrigin: `${x}px ${y}px` }}>
            <path
              d={`M ${x} ${y} Q ${x + (isLeft ? 25 : -25)} ${y - 25} ${x + (isLeft ? 45 : -45)} ${y} Q ${x + (isLeft ? 25 : -25)} ${y + 25} ${x} ${y}`}
              fill={leafColor}
              className="transition-colors duration-1000"
            />
            <g style={{ opacity: isBlooming ? 1 : 0, transition: 'opacity 0.7s ease-in-out', transform: isBlooming ? 'scale(1.2)' : 'scale(0.8)', transformOrigin: `${x + (isLeft ? 45 : -45)}px ${y}px` }}>
              <circle cx={x + (isLeft ? 50 : -50)} cy={y} r="10" fill={flowerColor} />
              <circle cx={x + (isLeft ? 50 : -50)} cy={y} r="4" fill={centerColor} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

export default function GardeningTips() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBlooming, setIsBlooming] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(Math.min(currentScroll / (totalScroll || 1), 1));

      // Check if user is near the footer to toggle the tool positioning
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setIsAtBottom(rect.top <= window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerWatering = () => {
    if (isWatering) return;
    setIsWatering(true);
    setIsBlooming(true);
    setTimeout(() => setIsWatering(false), 1500);
    setTimeout(() => setIsBlooming(false), 3000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Increased dynamic offset: 160px for navigation + padding
      const offset = 180;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 overflow-x-hidden">

      {/* --- Sticky Navigation --- */}
      <nav className="mx-auto z-[60] sticky mt-6 flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl border border-theme backdrop-blur-md shadow-lg bg-gradient-to-br from-green-50/50 to-green-100/50 text-zinc-800 dark:from-slate-900/50 dark:to-slate-950/50 w-fit">
        <div className="px-4 py-2 border-r border-zinc-200 dark:border-zinc-700 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-tighter">
          <Zap className="w-3 h-3 fill-emerald-600" /> Eco-Sync
        </div>
        {FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => scrollToSection(f.id)}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-600 transition-colors"
          >
            {f.id}
          </button>
        ))}
      </nav>

      {/* Background Vines */}
      <RealisticVine side="left" progress={scrollProgress} isBlooming={isBlooming} />
      <RealisticVine side="right" progress={scrollProgress} isBlooming={isBlooming} />

      {/* Main Content */}
      <main ref={mainRef} className="relative z-10 max-w-5xl mx-auto px-6 flex-grow justify-center">

        {/* --- Header Section --- */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 pt-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] border border-emerald-100 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> Environmental Synthesis
          </div>
          <p className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
            Eco-Sync<br /><span className="text-emerald-500 transition-colors duration-1000" style={{ color: isBlooming ? '#f59e0b' : '' }}>Operating</span>
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed font-medium">
            A digital biosphere that evolves with you. Scroll to initiate germination.
          </p>
        </section>

        <div className="mx-auto h-px animate-glow md:block animate-pulse bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mb-20" />

        {/* Feature Sections */}
        <div className="space-y-20 pb-20 mx-auto max-w-6xl justify-center mb-20">
          {FEATURES.map((feature, idx) => (
            <div
              id={feature.id}
              key={idx}
              className={`flex flex-col ${idx % 2 === 0 ? 'items-start' : 'items-end'} transition-all duration-1000 w-full scroll-mt-32`}
              style={{
                opacity: scrollProgress > (idx / FEATURES.length) * 0.8 ? 1 : 0,
                transform: `translateY(${scrollProgress > (idx / FEATURES.length) * 0.8 ? '0' : '60px'})`
              }}
            >
              <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 dark:inset-shadow-indigo-900/50">
                <div className="group max-w-md bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-emerald-500/10 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/40 backdrop-blur-2xl p-10 rounded-2xl transition-all hover:scale-[1.02] duration-500">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-1000 ${isBlooming ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                    {feature.icon}
                  </div>
                  <p className="text-4xl font-black uppercase mb-4 tracking-tighter italic">{feature.title}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                  <div className="mt-8 h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-700" style={{ backgroundColor: isBlooming ? '#f59e0b' : '' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Outro Area - Where Watering Tool will dock */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center mb-20 rounded-2xl shadow-xl md:px-40 px-20 md:pt-40 pt-20 pb-10 inset-shadow-sm inset-shadow-indigo-200/50 dark:inset-shadow-indigo-900/50">
          <div className={`p-12 rounded-full border-[12px] transition-all duration-1000 ${isBlooming ? 'border-amber-400 scale-125 shadow-[0_0_60px_rgba(245,158,11,0.4)]' : 'border-emerald-500 shadow-2xl'}`}>
            <Flower2 className={`w-32 h-32 transition-colors duration-1000 ${isBlooming ? 'text-amber-500 animate-spin-slow' : 'text-emerald-500'}`} />
          </div>

          <h2 className="mt-16 text-6xl font-black uppercase italic tracking-tighter">
            Ecosystem <span className="text-zinc-400">Stable</span>
          </h2>

          {/* --- Integrated Watering Tool --- */}
          <div className="mt-12 h-40 flex items-center justify-center">
            <button
              onClick={triggerWatering}
              disabled={isBlooming}
              className={`group relative p-8 rounded-full shadow-2xl transition-all duration-500 flex flex-col items-center gap-2 ${isBlooming ? 'bg-amber-500 text-white cursor-not-allowed scale-110' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-110 active:scale-90 text-white shadow-emerald-500/20'
                }`}
            >
              <Droplets className={`w-10 h-10 ${isWatering ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isBlooming ? "Nurturing..." : "Water Garden"}
              </span>

              {isWatering && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="absolute w-1 h-4 bg-sky-400 rounded-full animate-ping"
                      style={{ left: `${(i - 3) * 18}px`, top: '-30px', animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </button>
          </div>
        </section>
      </main>

      <footer ref={footerRef} className="relative z-[70] bg-white dark:bg-slate-950 border-t border-emerald-500/10 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-tighter mb-2">
              <Zap className="w-4 h-4" /> Eco-Sync OS
            </div>
            <p className="text-xs text-zinc-500 font-medium">© 2025 Bio-Digital Environments. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
            <p className="text-zinc-400 font-mono text-[10px] tracking-[0.5em] uppercase">
              v4.0.0-BIO
            </p>
            <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </footer>
    </div>
  );
}