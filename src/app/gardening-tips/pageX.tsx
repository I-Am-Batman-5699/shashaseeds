"use client";
import React, { useEffect, useRef, useState } from "react";
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Wind, 
  Bug, 
  Calendar, 
  Search, 
  ArrowRight,
  Info,
  ChevronRight,
  Leaf
} from "lucide-react";

/**
 * GARDENING TIPS JSON DATA (Mocking the external file)
 */
const GARDENING_TIPS_DATA = {
  header: {
    title: "Botanical Intelligence",
    tagline: "Synchronizing human care with nature's rhythm.",
    mission: "To provide genetically optimized cultivation protocols for modern ecosystems."
  },
  categories: [
    { id: "soil", name: "Soil Tech", icon: "sprout" },
    { id: "hydration", name: "Hydration", icon: "droplets" },
    { id: "climate", name: "Climate Control", icon: "sun" },
    { id: "defense", name: "Bio-Defense", icon: "bug" }
  ],
  tips: [
    {
      id: 1,
      category: "soil",
      title: "Nutrient Infusion Protocols",
      description: "Organic matter should comprise at least 5% of your soil matrix. Use composted biological waste to increase microbial activity.",
      importance: "Critical",
      tags: ["Microbiome", "Organic"]
    },
    {
      id: 2,
      category: "hydration",
      title: "Precision Water Delivery",
      description: "Water at the root zone during low-evaporation windows (0400h - 0800h) to maximize absorption and prevent fungal spores.",
      importance: "High",
      tags: ["Efficiency", "Timing"]
    },
    {
      id: 3,
      category: "climate",
      title: "Solar Exposure Optimization",
      description: "Most high-energy cultivars require 6+ hours of direct solar radiation. Monitor shadow patterns across the biological quarter.",
      importance: "Variable",
      tags: ["Photons", "Energy"]
    },
    {
      id: 4,
      category: "defense",
      title: "Integrated Pest Management",
      description: "Introduce beneficial predatory insects like Hippodamia convergens to eliminate aphid infestations without chemical interference.",
      importance: "Steady",
      tags: ["Bio-Control", "Safety"]
    },
    {
      id: 5,
      category: "soil",
      title: "PH Level Equilibrium",
      description: "Maintain a pH range of 6.0 to 7.0 for optimal nutrient bioavailability. Test your substrate every 90 solar cycles.",
      importance: "Medium",
      tags: ["Chemistry", "Substrate"]
    }
  ]
};

// Reuse the ScrollFadeIn component logic for consistent UI
const ScrollFadeIn = ({ children, direction = 'up', delay = 0, className = '', id }:{ children?:React.ReactNode, direction?:string, delay?:number, className?:string, id?:string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  const baseTransition = `transition-all duration-1000 ease-out ${className}`;
  let transformClasses = 'opacity-0';
  if (direction === 'up') transformClasses += ' translate-y-8';
  else if (direction === 'left') transformClasses += ' -translate-x-8';
  else if (direction === 'right') transformClasses += ' translate-x-8';
  else if (direction === 'down') transformClasses += ' -translate-y-8';

  const visibleClasses = 'opacity-100 translate-y-0 translate-x-0';

  return (
    <div
      id={id}
      ref={ref}
      className={`${baseTransition} ${isVisible ? visibleClasses : transformClasses} rounded-2xl shadow-xl p-2`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const IconMap = {
  sprout: Sprout,
  droplets: Droplets,
  sun: Sun,
  bug: Bug,
  wind: Wind
};

const DynamicIcon = ({ name, className }: { name:string, className:string }) => {
  const IconComponent = IconMap[name as keyof typeof IconMap] || Info;
  return <IconComponent className={className} />;
};

export default function GardeningTips() {
  const [tips, setTips] = useState(GARDENING_TIPS_DATA.tips);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTips = tips.filter(tip => {
    const matchesCategory = activeCategory === "all" || tip.category === activeCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 font-sans">
      
      {/* --- Sticky Navigation Bar --- */}
      <div className="mx-auto mt-4 lg:max-w-[90%] w-full sticky top-4 z-50 flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg bg-white/30 dark:bg-slate-900/50">
        <nav className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all ${activeCategory === 'all' ? 'bg-emerald-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'}`}
          >
            All Logs
          </button>
          {GARDENING_TIPS_DATA.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all ${activeCategory === cat.id ? 'bg-emerald-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'}`}
            >
              <DynamicIcon name={cat.icon} className="w-3 h-3" />
              {cat.name}
            </button>
          ))}
        </nav>
        
        <div className="relative flex-grow max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search Database..." 
            className="w-full bg-white/50 dark:bg-slate-800/50 border border-emerald-500/20 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="mx-auto lg:max-w-[90%] md:max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* --- Header & Mission Section --- */}
        <ScrollFadeIn direction="up" id="botanical-header">
          <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-tighter mb-2">
              <Leaf className="w-4 h-4 animate-pulse" /> Global System Status: Operational
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-emerald-800 dark:text-emerald-500 drop-shadow-md">
              {GARDENING_TIPS_DATA.header.title}
            </h1>
            <p className="text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto italic">
              {GARDENING_TIPS_DATA.header.tagline}
            </p>
            
            <div className="max-w-4xl mx-auto mt-8 p-6 rounded-3xl border-2 border-emerald-500/20 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sprout className="w-32 h-32 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-[0.2em]">Primary Objective</p>
              <p className="text-xl md:text-2xl font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {GARDENING_TIPS_DATA.header.mission}
              </p>
            </div>
          </header>
        </ScrollFadeIn>

        {/* --- Tips Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip, index) => (
            <ScrollFadeIn 
              key={tip.id} 
              direction="up" 
              delay={index * 100} 
              className="h-full"
            >
              <div className="group h-full flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/10 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 relative overflow-hidden">
                
                {/* Holographic accent */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <DynamicIcon name={GARDENING_TIPS_DATA.categories.find(c => c.id === tip.category)?.icon as string} className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                    tip.importance === 'Critical' ? 'border-red-500/50 text-red-500 bg-red-500/5' :
                    tip.importance === 'High' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' :
                    'border-emerald-500/50 text-emerald-500 bg-emerald-500/5'
                  }`}>
                    {tip.importance}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-3 group-hover:text-emerald-600 transition-colors">
                  {tip.title}
                </h3>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono flex-grow">
                  {tip.description}
                </p>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
                  {tip.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-1 rounded-md uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold uppercase tracking-widest cursor-pointer hover:gap-2 transition-all">
                  Read Full Protocol <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </section>

        {/* --- Empty State --- */}
        {filteredTips.length === 0 && (
          <div className="text-center py-20 bg-white/20 dark:bg-slate-900/20 rounded-3xl border border-dashed border-emerald-500/30">
            <Search className="w-12 h-12 text-zinc-400 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold text-zinc-500">No protocol found matching your query.</p>
            <button 
              onClick={() => {setActiveCategory("all"); setSearchQuery("");}}
              className="mt-4 text-emerald-600 underline text-sm"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

        {/* --- Footer Status Card --- */}
        <ScrollFadeIn direction="up" delay={200}>
          <div className="p-8 rounded-3xl bg-slate-900 text-white border border-emerald-500/30 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
            <p className="text-emerald-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Maintenance Cycle
            </p>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
              Database synchronized with local solar cycles. Ensure your biosphere monitoring hardware is calibrated to Protocol 9-V.
            </p>
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 inline-flex items-center gap-2">
              Export Tip Logs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollFadeIn>

      </main>

      <footer className="py-8 text-center border-t border-emerald-500/10 text-zinc-500 dark:text-zinc-600 text-xs uppercase tracking-[0.3em]">
        &copy; 2025 Botanical Orchestration Systems // Ref: UI-GARDEN-01
      </footer>
    </div>
  );
}