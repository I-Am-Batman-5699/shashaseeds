"use client";

import React, { useEffect, useState, useCallback, useContext, createContext } from "react";
import companyData from "@/data/company.json";
import uiElements from "@/data/ui-elements.json";
import appContext from "../../../public/models/appContentTexts.json";

const APP_CONTEXT = appContext;
const COMPANY_DATA = companyData;
const UI_ELEMENTS = uiElements;


const FooterContent = () => {
    const { companyInfo, contactInfo, socialLinks } = COMPANY_DATA;
    const { footerSections, supportLinks } = UI_ELEMENTS;
    const { appData } = APP_CONTEXT;

    return (
        <footer className="w-full relative overflow-hidden transition-colors duration-300 bg-zinc-950 text-white/80 dark:text-white">
            <div className="mx-auto max-w-[98%] md:pb-1 pb-2 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl/30 inset-shadow-xs inset-shadow-slate-700/20">
                    <div className="mx-auto p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                            {/* COLUMN 1 & 2: Dynamic Sections (Links). Quick links and categories */}
                            {footerSections.map((section) => (
                                <div key={section.id} className="rounded-2xl shadow-xl/30 p-4 inset-shadow-xs inset-shadow-slate-700/20">
                                    <p className="sm:text-md md:text-lg lg:text-xl font-semibold mb-2 relative inline-block">
                                        {section.title}
                                    </p>
                                    <ul className="space-y-2 ml-2">
                                        {section.links.filter(link => link.visible).map((link) => (
                                            <li key={link.id}>
                                                <a
                                                    href={link.href}
                                                    className="sm:text-xs md:text-sm lg:text-md hover:text-accent transition-colors flex items-center gap-2 group font-sans"
                                                >
                                                    <span className="rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* COLUMN 3: Contact Info */}
                            <div className="rounded-2xl shadow-xl/30 p-4 inset-shadow-xs inset-shadow-slate-700/20">
                                <p className="sm:text-md md:text-lg lg:text-xl font-semibold mb-4 relative inline-block">
                                    Contact Us
                                </p>
                                <ul className="space-y-4 ml-2">
                                    <li className="flex items-start gap-3 group">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-3 w-full"
                                            aria-label={`Find ${contactInfo.address} on map`}
                                        >

                                            <svg className="h-5 w-5 text-accent mt-0.5 group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.7c-3.3 0-6-2.7-6-6s6-12 6-12 6 8.7 6 12-2.7 6-6 6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
                                            <span className="text-secondary-text text-sm">
                                                {contactInfo.address}
                                            </span>
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-3 group">
                                        <svg className="h-5 w-5 text-accent group-hover:animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.72-6.72 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.74 17.61 17.61 0 0 0 .8 3.56A2 2 0 0 1 8.87 8.1l-1.34 1.34a13.3 13.3 0 0 0 6.72 6.72l1.34-1.34a2 2 0 0 1 2.15-.45 17.61 17.61 0 0 0 3.56.8A2 2 0 0 1 22 16.92z" /></svg>
                                        <span className="text-secondary-text text-sm">
                                            {contactInfo.phone}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3 group">
                                        <svg className="h-5 w-5 text-accent group-hover:animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        <a href={`mailto:${contactInfo.email}`} className="text-secondary-text text-sm hover:underline">
                                            {contactInfo.email}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/*Column 4 Brand Info */}
                            <div className="space-y-4 rounded-2xl shadow-xl/30 p-4 inset-shadow-xs inset-shadow-slate-700/20">
                                <a href="/" className="flex items-center gap-2 mb-4 group cursor-pointer">
                                    <div className="p-2 rounded-full bg-green-600 group-hover:bg-accent/20 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" >
                                            <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold tracking-tight">
                                        {appData.appName}
                                    </span>
                                </a>
                                <p className="text-secondary-text text-sm leading-relaxed max-w-xs">
                                    {companyInfo.description}
                                </p>

                                {/* Social Icons mapped from JSON */}
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {socialLinks && socialLinks.length > 0 && socialLinks.map((social) => (
                                        social.visible && (
                                            <a
                                                key={social.id}
                                                href={social.enabled ? social.href : "#"}
                                                className={`p-2 rounded-full border border-theme text-secondary-text transition-all duration-300 transform hover:-translate-y-1 social-icon-${social.id} ${!social.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
                                                aria-label={social.name}
                                            >
                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d={social.icon} />
                                                </svg>
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* BOTTOM BAR */}
                    <div>
                        <div className="w-full h-px animate-glow md:block animate-pulse bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mb-2" />
                        <div className="border-theme max-w-7xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-6 justify-center">
                                {supportLinks.filter(item => item.visible).map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.enabled ? item.href : "#"}
                                        className={`sm:text-xs md:text-sm lg:text-md text-secondary-text hover:text-accent transition-colors ${!item.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                            <p className="text-secondary-text sm:text-xs md:text-sm lg:text-md">
                                {appData.copy}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function Footer() {
    return (
        <FooterContent />
    );
}