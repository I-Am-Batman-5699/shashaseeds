"use client";
import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, Share2, ShieldCheck, CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import DoubleHelix from "@/components/loaders/DoubleHelix";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";
import { Turnstile } from "@marsidev/react-turnstile";

import companyData from "@/data/company.json";

export default function ContactPage() {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, token }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", message: "" });
            } else {
                const data = await response.json();
                alert(`TRANSMISSION ERROR: ${data.message}`);
            }
        } catch (err) {
            alert("CRITICAL ERROR: System uplink failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col text-zinc-800 dark:text-zinc-50 min-h-[90vh] transition-colors duration-500">
            <div className="mx-auto lg:min-w-[95%] xl:max-w-7xl md:pb-16 pb-8 md:pt-12 pt-4 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-8">
                        <DoubleHelix />
                        <p className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse text-green-500">
                            Establishing Secure Protocol...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Header Section */}
                        <ScrollFadeIn direction="down">
                            <div className="text-center space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-100">
                                    {companyData.companyInfo.name.split(' ')[0]} <span className="text-green-500">{companyData.companyInfo.name.split(' ')[1]}</span>
                                </h1>
                                <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm md:text-base max-w-2xl mx-auto italic">
                                    <span className="text-green-500">::</span> {companyData.companyInfo.tagline}
                                </p>
                            </div>
                        </ScrollFadeIn>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Sidebar - Remains visible */}
                            <ScrollFadeIn direction="left" className="lg:col-span-2 space-y-6">
                                <div className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl space-y-8 h-full">
                                    <div className="space-y-6">
                                        {/* Address Section - Back at the top */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-widest">Physical_Coord</p>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyData.contactInfo.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold leading-tight hover:text-green-500 transition-colors block"
                                                >
                                                    {companyData.contactInfo.address}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-widest">Email_Node</p>
                                                <p className="font-bold break-all">{companyData.contactInfo.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-mono uppercase text-zinc-400 tracking-widest">Comm_Link</p>
                                                <a href={`tel:${companyData.contactInfo.phone.replace(/\s+/g, '')}`} className="font-bold hover:text-green-500 transition-colors">
                                                    {companyData.contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Socials & System Status */}
                                    <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                                        <div className="flex items-center gap-2 mb-4 text-green-500">
                                            <Share2 className="h-4 w-4" />
                                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Social Uplinks</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {companyData.socialLinks.filter(link => link.visible).map((social) => (
                                                <a key={social.id} href={social.href} target="_blank" className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 hover:bg-green-500/5 transition-all group">
                                                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 text-zinc-500 group-hover:text-green-500">
                                                        <path d={social.icon} />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="font-mono text-[9px] text-zinc-500/50 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                        <p>{`> ENCRYPTION: AES-256`}</p>
                                        <p className={isSuccess ? "text-green-500" : ""}>{`> STATUS: ${isSuccess ? "SUCCESS_SENT" : "AWAITING_INPUT"}`}</p>
                                    </div>
                                </div>
                            </ScrollFadeIn>

                            {/* Form Section / Success Section */}
                            <ScrollFadeIn direction="right" className="lg:col-span-3">
                                {isSuccess ? (
                                    <div className="p-12 rounded-3xl border border-green-500/30 bg-green-500/5 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="p-6 rounded-full bg-green-500/20 text-green-500 animate-bounce">
                                            <CheckCircle2 className="h-16 w-16" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">Transmission Successful</h3>
                                            <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                                                Your data packet has been encrypted and delivered to the Shasha Seeds core.
                                                Our agents will respond via the provided comm-link shortly.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsSuccess(false)}
                                            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-green-500 hover:text-green-400 transition-colors"
                                        >
                                            <RefreshCcw className="h-3 w-3" /> Initialize New Session
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Name</label>
                                                <input
                                                    disabled={isSubmitting}
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:border-green-500 font-mono text-sm outline-none transition-colors"
                                                    placeholder="Enter name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Email</label>
                                                <input
                                                    disabled={isSubmitting}
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:border-green-500 font-mono text-sm outline-none transition-colors"
                                                    placeholder="Enter email"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Seed Enquiry Details</label>
                                            <textarea
                                                disabled={isSubmitting}
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:border-green-500 font-mono text-sm resize-none outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/20 border border-dashed border-zinc-300 dark:border-zinc-700">
                                            <div className="flex items-center gap-2 mb-4 text-zinc-400">
                                                <ShieldCheck className={`h-4 w-4 ${token ? 'text-green-500' : 'text-zinc-500'}`} />
                                                <span className="text-[10px] font-mono uppercase tracking-widest">Integrity_Check</span>
                                            </div>
                                            <Turnstile
                                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                                                onSuccess={(t) => setToken(t)}
                                                onExpire={() => setToken(null)}
                                                options={{ theme: 'auto', size: 'normal' }}
                                            />
                                        </div>

                                        <button
                                            disabled={!token || isSubmitting}
                                            className="group flex items-center justify-center gap-3 w-full py-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {isSubmitting ? (
                                                <>Encrypting... <Loader2 className="h-4 w-4 animate-spin" /></>
                                            ) : (
                                                <>Send enquiry <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </ScrollFadeIn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}