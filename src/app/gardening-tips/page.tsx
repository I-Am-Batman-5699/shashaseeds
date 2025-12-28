"use client";
import React, { useEffect, useState, useRef } from "react";
import LucideIconCustom, { IconName } from "@/components/ui/lucideIcons";
import { GardeningTips, Hero, Outro } from "@/types/gardeningTips";
import { FetchItems } from "@/lib/fetcher";
import DoubleHelix from "@/components/loaders/DoubleHelix";
import HelixHorizontal from "@/components/loaders/HelixHorizontal";

const VineFlower = ({ active, delay }: { active: boolean, delay: number }) => {
  return (
    <g
      style={{
        transform: `scale(${active ? 1 : 0})`,
        transition: `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`,
        transitionDelay: `${delay}ms`,
        transformOrigin: 'center',
        opacity: active ? 1 : 0
      }}
    >
      <circle cx="0" cy="-5" r="4.5" fill="#fbbf24" />
      <circle cx="0" cy="5" r="4.5" fill="#fbbf24" />
      <circle cx="-5" cy="0" r="4.5" fill="#f59e0b" />
      <circle cx="5" cy="0" r="4.5" fill="#f59e0b" />
      <circle cx="0" cy="0" r="3" fill="#78350f" />
    </g>
  );
};

const LeafNode = ({ x, y, active, isBlooming, index }: { x: number, y: number, active: boolean, isBlooming: boolean, index: number }) => {
  const alternateSide = index % 2 === 0 ? -1 : 1;
  const leafAngle = alternateSide === -1 ? -30 : 30;
  const stemColor = "#064e3b";
  const leafColor = "#10b981";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <line
        x1="0" y1="0"
        x2={alternateSide * 15} y2="-5"
        stroke={stemColor}
        strokeWidth="2"
        style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s' }}
      />
      <g
        style={{
          opacity: active ? 0.9 : 0,
          transform: `scale(${active ? 1 : 0}) rotate(${leafAngle}deg)`,
          transformOrigin: '0px 0px',
          transition: 'all 0.6s ease-out'
        }}
      >
        <path
          d={`M 0 0 C ${alternateSide * 20} -20, ${alternateSide * 40} -10, ${alternateSide * 45} 0 C ${alternateSide * 40} 10, ${alternateSide * 20} 20, 0 0`}
          fill={leafColor}
        />
        <g transform={`translate(${alternateSide * 10}, -3)`}>
          <VineFlower active={isBlooming && active} delay={index * 100} />
        </g>
      </g>
    </g>
  );
};

const RealisticVine = ({ isLeftVine, progress, isBlooming }: { isLeftVine: boolean, progress: number, isBlooming: boolean }) => {
  const pathD = isLeftVine
    ? "M 30 1000 C 100 850, 10 700, 80 550 C 120 400, 20 250, 60 100 T 40 0"
    : "M 170 1000 C 100 850, 190 700, 120 550 C 80 400, 180 250, 140 100 T 160 0";

  const nodes = [
    { p: 0.1, x: isLeftVine ? 40 : 160 },
    { p: 0.25, x: isLeftVine ? 75 : 125 },
    { p: 0.4, x: isLeftVine ? 55 : 145 },
    { p: 0.55, x: isLeftVine ? 95 : 105 },
    { p: 0.7, x: isLeftVine ? 65 : 135 },
    { p: 0.85, x: isLeftVine ? 50 : 150 },
    { p: 0.95, x: isLeftVine ? 42 : 158 },
  ];

  return (
    <svg
      viewBox="0 0 200 1000"
      className={`fixed bottom-0 ${isLeftVine ? 'left-0' : 'right-0'} h-screen w-[15vw] pointer-events-none z-40 overflow-visible`}
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke="#064e3b"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1000"
        strokeDashoffset={1000 - (progress * 1000)}
        className="transition-all duration-200"
      />
      {nodes.map((node, i) => (
        <LeafNode
          key={i}
          index={i}
          x={node.x}
          y={1000 - (node.p * 1000)}
          active={progress > node.p}
          isBlooming={isBlooming}
        />
      ))}
    </svg>
  );
};

const FeatureCard = ({ feature, index, isBlooming }: { feature: { id: string, iconName: string, title: string, desc: string }, index: number, isBlooming: boolean }) => {
  const [styles, setStyles] = useState({ opacity: 0, translateY: 40 });
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const dist = (viewportCenter - (rect.top + rect.height / 2)) / viewportCenter;
      setStyles({ opacity: Math.max(0, 1 - Math.abs(dist) * 1.5), translateY: dist * -50 });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      id={feature.id}
      className={`group flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'} items-center w-full mb-12 transition-all scroll-mt-50`}
      style={{
        opacity: styles.opacity,
        transform: `translateY(${styles.translateY}px)`
      }}
    >
      <div className={`w-full max-w-md bg-white/80 dark:bg-slate-900/80 border p-8 rounded-3xl backdrop-blur-md transition-all duration-700 cursor-default relative overflow-hidden ${isBlooming ? 'border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]' : 'border-emerald-500/10 shadow-lg hover:shadow-emerald-500/5 hover:scale-[1.03]'} rounded-2xl shadow-xl p-4 md:p-6 inset-shadow-sm inset-shadow-indigo-200/50 dark:inset-shadow-indigo-900/50`}>

        <div
          className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ease-in-out z-20 ${isBlooming ? 'w-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'w-0 group-hover:w-full bg-emerald-500'
            }`}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isBlooming ? 'opacity-5 bg-amber-500' : 'opacity-0 group-hover:opacity-5 bg-emerald-500'
            }`}
        />

        <div className={` ${index % 2 === 0 ? 'flex justify-end group-hover:-translate-y-1 group-hover:rotate-6' : 'flex justify-start group-hover:translate-y-1'}`}>
          <div className={`w-6 h-6 rounded-2xl mb-1 transition-all duration-500 ${isBlooming ? 'text-amber-600 scale-110 rotate-3' : 'text-emerald-600 group-hover:text-emerald-500 group-hover:scale-110'} group-hover:-translate-y-4 ${index % 2 === 0 ? ' group-hover:rotate-6' : 'group-hover:-rotate-6'}`}>
            <LucideIconCustom
              name={feature.iconName as IconName}
              className="w-6 h-6"
            />
          </div>
        </div>

        <p className={`text-3xl font-black uppercase italic tracking-tighter mb-4 transition-colors duration-500 ${isBlooming ? 'text-amber-600' : 'text-slate-900 dark:text-white group-hover:text-emerald-600'}`}>
          {feature.title}
        </p>

        <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-500">
          {feature.desc}
        </p>

        {isBlooming && (
          <div className="absolute top-2 right-4 text-amber-500/40 animate-pulse">
            <LucideIconCustom name="sparkles" size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBlooming, setIsBlooming] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const [gardeningTips, setGardeningTips] = useState<GardeningTips>();
  const [gardeningHeroContent, setGardeningHeroContent] = useState<Hero>();
  const [gardeningOutroContent, setGardeningOutroContent] = useState<Outro>();
  const [gardeningTipsLoading, setGardeningTipsLoading] = useState(true);


  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / totalScrollableHeight, 0), 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerBloom = () => {
    setIsWatering(true);
    setTimeout(() => {
      setIsWatering(false);
      setIsBlooming(true);
      setTimeout(() => setIsBlooming(false), 5000);
    }, 1000);
  };

  const fetchGardenTips = async () => {
    const response = await FetchItems({ path: "/models/gardening-tips.json" });
    if (response.status === "S" && response.data) {
      setGardeningTips(response.data.tips as GardeningTips);
      setGardeningHeroContent(response.data.hero as Hero);
      setGardeningOutroContent(response.data.outro as Outro);
    }
    else if (response.status === "E") {
      console.error(response.error);
    }
    else {
      console.error("Unknown error occurred while fetching gardening content");
    }
    if (setGardeningTipsLoading) {
      setGardeningTipsLoading(false);
    }
  }

  useEffect(() => {
    setGardeningTipsLoading(true);
    fetchGardenTips();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-700 min-h-screen">
      {
        gardeningTipsLoading ? <HelixHorizontal customClass="relative top-20" /> : (
          <nav className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-emerald-500/10 px-6 py-2 rounded-full shadow-xl flex gap-6">
            {gardeningTips && Array.isArray(gardeningTips) && gardeningTips.map(f => (
              <button
                key={f.id}
                onClick={() => {
                  const el = document.getElementById(f.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 hover:scale-110 hover:text-emerald-500 transition-all"
              >
                {f.id}
              </button>
            ))}
          </nav>
        )
      }

      <RealisticVine isLeftVine={true} progress={scrollProgress} isBlooming={isBlooming} />
      <RealisticVine isLeftVine={false} progress={scrollProgress} isBlooming={isBlooming} />

      {
        gardeningTipsLoading ? <DoubleHelix /> : (
          <main ref={mainRef} className="max-w-5xl mx-auto px-6 relative z-10">
            <section className="h-screen flex flex-col items-center justify-center text-center">
              <div className="mb-8 px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                {gardeningHeroContent?.tag}
              </div>
              <p className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
                {gardeningHeroContent?.titleMain}<span className="text-emerald-600">{gardeningHeroContent?.titleAccent}</span>
              </p>
              <p className="mt-6 text-xl text-zinc-500 max-w-md font-medium">{gardeningHeroContent?.description}</p>
              <div className="mt-20 animate-bounce opacity-20"><LucideIconCustom name="arrowDown" size={40} /></div>
            </section>

            <section className="py-20">
              {gardeningTips && Array.isArray(gardeningTips) && gardeningTips.map((f, i) => (
                <FeatureCard key={f.id} feature={f as unknown as { id: string, iconName: string, title: string, desc: string }} index={i} isBlooming={isBlooming} />
              ))}
            </section>

            {/* Final Responsive Section */}
            <section className="min-h-screen flex flex-col items-center justify-center pb-40 px-4">
              <div className={`p-8 md:p-12 rounded-full border-[8px] md:border-[12px] transition-all duration-1000 ${isBlooming ? 'border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.2)]' : 'border-emerald-500/10'}`}>
                <LucideIconCustom name="flower2" className={`w-16 h-16 md:w-32 md:h-32 transition-all duration-700 ${isBlooming ? 'text-amber-500 scale-110' : 'text-emerald-700'}`} />
              </div>

              <p className="text-3xl sm:text-5xl md:text-8xl font-black italic uppercase tracking-tighter mt-8 md:mt-12 mb-8 md:mb-12 text-center">
                {gardeningOutroContent?.titlePrefix} <span className={isBlooming ? 'text-amber-500 transition-colors' : 'text-emerald-600 transition-colors'}>
                  {isBlooming ? gardeningOutroContent?.stateActive : gardeningOutroContent?.stateIdle}
                </span>
              </p>

              <button
                onClick={triggerBloom}
                disabled={isBlooming || isWatering}
                className={`group w-full max-w-[320px] md:max-w-none md:w-auto px-8 md:px-12 py-4 md:py-6 rounded-full font-black uppercase text-xs md:text-base tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${isBlooming ? 'bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
              >
                {isWatering ? <LucideIconCustom name="cloudRain" className="animate-bounce" /> : <LucideIconCustom name="droplets" className="group-hover:translate-y-1 transition-transform" />}
                <span className="truncate">
                  {isWatering ? gardeningOutroContent?.btnLoading : isBlooming ? gardeningOutroContent?.btnSuccess : gardeningOutroContent?.btnAction}
                </span>
              </button>
            </section>
          </main>
        )}

      <style jsx global>{`
        body { scroll-behavior: smooth; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
}