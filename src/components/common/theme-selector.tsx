"use client";

import React, { useEffect, useState, useCallback, useContext, createContext } from "react";

type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeContextType { theme: ThemeMode; setTheme: (mode: ThemeMode) => void; currentMode: 'light' | 'dark'; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) { throw new Error('useTheme must be used within a ThemeProvider'); }
    return context;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        try { const storedTheme = localStorage.getItem('app-theme') as ThemeMode; return storedTheme || 'system'; } catch (error) { console.error(error); return 'system'; }
    });
    const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
    const calculateMode = useCallback((currentTheme: ThemeMode) => {
        if (currentTheme === 'light') return 'light';
        if (currentTheme === 'dark') return 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        const initialMode = calculateMode(theme);
        setCurrentMode(initialMode);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            if (theme === 'system') { setCurrentMode(e.matches ? 'dark' : 'light'); }
        };
        if (theme === 'system') { mediaQuery.addEventListener('change', handler); }
        return () => { mediaQuery.removeEventListener('change', handler); };
    }, [theme, calculateMode]);

    useEffect(() => { setCurrentMode(calculateMode(theme)); }, [theme, calculateMode]);
    const value = { theme, setTheme, currentMode };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const { currentMode } = useTheme();

    const themeClass = currentMode === 'dark' ? 'theme-dark' : '';

    return (
        <div className={`app-container ${themeClass}`}>
            {children}
        </div>
    );
};

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();
    const themes: { mode: ThemeMode, label: string }[] = [{ mode: 'light', label: 'Light' }, { mode: 'dark', label: 'Dark' }, { mode: 'system', label: 'System' },];

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
            {/* This div uses semantic colors for its background, border, and shadow */}
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

export default function ThemedApp() {
    return (
        <ThemeProvider>
            <ThemeWrapper>
                <ThemeSelector />
            </ThemeWrapper>
        </ThemeProvider>
    );
}