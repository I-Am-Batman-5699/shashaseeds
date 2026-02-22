"use client";

import { FetchItems } from "@/lib/fetcher";
import React, { useEffect, useState } from "react";
import companyData from "@/data/company.json";
import uiElements from "@/data/ui-elements.json";
import { AppContextType, AppData } from "@/types/appContextText";
import HelixHorizontal from "../loaders/HelixHorizontal";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react"; // Make sure to install lucide-react

const COMPANY_DATA = companyData;
const UI_ELEMENTS = uiElements;

const FooterContent = () => {
    const { companyInfo, contactInfo, socialLinks } = COMPANY_DATA;
    const { footerSections, supportLinks } = UI_ELEMENTS;
    const [appData, setAppData] = useState<AppData | null>(null);
    const [appDataLoading, setAppDataLoading] = useState(true);

    const fetchData = async () => {
        const response = await FetchItems({ path: '/models/appContextText.json' });
        if (response.status === "S" && response.data) {
            setAppData((response.data as AppContextType)?.appData);
        }
        setAppDataLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <footer className="w-full relative overflow-hidden bg-zinc-950 text-white/80 border-t border-zinc-900">
            <div className="mx-auto max-w-[98%] pb-4 pt-8">
                {appDataLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <HelixHorizontal />
                    </div>
                ) : (
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                            {/* COLUMN 2: Quick Links */}
                            {footerSections.map((section) => (
                                <div key={section.id}>
                                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-green-500 mb-6">{section.title}</h4>
                                    <ul className="space-y-3">
                                        {section.links.filter(link => link.visible).map((link) => (
                                            <li key={link.id}>
                                                <a href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center group">
                                                    <span className="w-0 group-hover:w-2 h-[1px] bg-green-500 transition-all mr-0 group-hover:mr-2"></span>
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* COLUMN 4: Contact (Re-styled as Nodes) */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-green-500 mb-6">Contact_Nodes</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase">Physical_Coord</p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                                                target="_blank"
                                                className="text-sm text-zinc-300 hover:text-green-400 transition-colors"
                                            >
                                                {contactInfo.address}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Mail className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase">Mail_Link</p>
                                            <a href={`mailto:${contactInfo.email}`} className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase">Voice_Comm</p>
                                            <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-sm text-zinc-300 hover:text-green-400 transition-colors">
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 1: Brand Info - Responsive Check */}
                            <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                                <a
                                    href="/"
                                    className="flex items-center gap-3 group transition-transform hover:scale-105"
                                >
                                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                        <div className="text-green-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold tracking-tighter text-white whitespace-nowrap">
                                        {appData?.appName}
                                    </span>
                                </a>

                                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm md:border-l-2 md:border-green-500/20 md:pl-4">
                                    {companyInfo.description}
                                </p>

                                <div className="flex gap-3 justify-center md:justify-start">
                                    {socialLinks?.filter(s => s.visible).map((social) => {
                                        const isEnabled = social.enabled !== false; // Default to true if not specified
                                        return (
                                            <a
                                                key={social.id}
                                                href={isEnabled ? social.href : "#"}
                                                onClick={(e) => !isEnabled && e.preventDefault()} // Block click if disabled
                                                className={`p-2 rounded-lg bg-zinc-900 border transition-all ${isEnabled
                                                    ? "border-zinc-800 text-zinc-400 hover:text-green-500 hover:border-green-500/50 shadow-sm"
                                                    : "border-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed"
                                                    }`}
                                                aria-disabled={!isEnabled}
                                            >
                                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d={social.icon} />
                                                </svg>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* BOTTOM BAR */}
                        <div className="flex gap-6">
                            {supportLinks.filter(l => l.visible).map((link) => {
                                const isEnabled = link.enabled !== false;
                                return (
                                    <a
                                        key={link.id}
                                        href={isEnabled ? link.href : "#"}
                                        onClick={(e) => !isEnabled && e.preventDefault()}
                                        className={`text-xs transition-colors ${isEnabled
                                            ? "text-zinc-500 hover:text-zinc-300"
                                            : "text-zinc-700 cursor-not-allowed opacity-50"
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
}

export default function Footer() {
    return <FooterContent />;
}