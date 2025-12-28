"use client";

import React, { useState, useEffect } from "react";


export default function ThemeToggle() {
    const [activeTheme, setActiveTheme] = useState("system");

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) {
            setActiveTheme(saved);
            applyTheme(saved);
        } else {
            applyTheme("system");
        }
    }, []);

    const applyTheme = (theme: string) => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else if (theme === "light") {
            root.classList.remove("dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            prefersDark ? root.classList.add("dark") : root.classList.remove("dark");
        }
    };

    const handleThemeChange = (theme: string) => {
        setActiveTheme(theme);
        localStorage.setItem("theme", theme);
        applyTheme(theme);
    };

    const themes: { value: string; label: string; icon: string }[] = [
        { value: "light", label: "Light", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
        { value: "dark", label: "Dark", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
        { value: "system", label: "System", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
    ];

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Appearance
            </p>
            <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => (
                    <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-xl
              border-2 transition-all duration-200
              ${activeTheme === theme.value
                                ? "border-accent bg-accent/10 shadow-lg"
                                : "border-transparent hover:border-theme hover:bg-secondary-bg"
                            }
            `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-5 h-5 ${activeTheme === theme.value ? "text-accent" : "text-secondary-text"}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d={theme.icon} />
                        </svg>
                        <span className={`text-xs font-medium ${activeTheme === theme.value ? "text-primary-text" : "text-secondary-text"}`}>
                            {theme.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
