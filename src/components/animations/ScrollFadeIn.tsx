"use client";

import React, { useEffect, useState, useRef } from 'react';

const ScrollFadeIn = ({ children, direction = 'up', delay = 0, className = '' }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right' | 'down', delay?: number, className?: string }) => {
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
            ref={ref}
            className={`${baseTransition} ${isVisible ? visibleClasses : transformClasses} rounded-2xl border border-theme bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-slate-900/50 dark:to-slate-950/50 shadow-lg md:p-4 p-2 inset-shadow-xs dark:inset-shadow-indigo-900/50 backdrop-blur-md`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default ScrollFadeIn;