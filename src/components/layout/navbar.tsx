"use client";

import Avatar from '@mui/material/Avatar';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Import JSON data
import navigationData from "@/data/navigation.json";
import companyData from "@/data/company.json";
import uiElementsData from "@/data/ui-elements.json";
import icons from "@/data/icons.json";
import userData from "@/data/user-data.json";

// Import types
import { NavigationItem, ActionButton } from "@/types/navigation";

import HamburgerButton from "@/components/ui/hamburgerButton";
import SVGIcon from "@/components/ui/svgIcon";
import ProfileOverlay from "@/components/ui/profileOverlay";
import MobileProfileModal from "@/components/modals/profileModal";

import useIsTouchDevice from '@/hooks/useIsTouchDevice';

export default function HeaderNavbar({ isLoading = false }: { isLoading?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigationItems: NavigationItem[] = navigationData.navigationItems;
    const actionButtons: ActionButton[] = uiElementsData.actionButtons as ActionButton[];
    const company = companyData.companyInfo;
    const svgIcons = icons.svg;
    const isTouchDevice = useIsTouchDevice();

    const currentUser = isLoggedIn ? userData.user : userData.unknownUser;

    const navRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isTouchDevice) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setExpandedItems({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isTouchDevice]);

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        console.log("User logged in (dummy)");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log("User logged out (dummy)");
    };

    const toggleProfile = () => {
        setProfileOpen(prev => !prev);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toggleMobileProfile = () => {
        setMobileProfileOpen(prev => !prev);
    };

    const loadingClass = isLoading ? "pointer-events-none opacity-60" : "";

    return (
        <>
            <header
                className={`mt-0.5 top-0 sticky z-[100] w-full ${loadingClass}  bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50`}
                aria-disabled={isLoading}
            >
                <div className={`lg:px-4 min-h-15 flex items-center justify-between border border-theme backdrop-blur-md shadow-lg  bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 rounded-2xl m-0.5`}>

                    {/* ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Desktop ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ */}

                    {/* Desktop Profile Icon */}
                    <div className="items-center gap-1 md:m-1 p-1 hidden lg:flex">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleProfile();
                            }}
                            className="rounded-full hover:ring-2 hover:ring-accent transition-all duration-200 hover:scale-105"
                            aria-label="Toggle profile"
                        >
                            <Avatar
                                alt={currentUser.name}
                                src={currentUser.avatar}
                                sx={{ width: 40, height: 40 }}
                            />
                        </button>
                    </div>

                    {/* Desktop navigation (UNCHANGED) */}
                    <nav ref={navRef} className="hidden lg:flex items-center gap-8 text-sm text-zinc-800 dark:text-zinc-50 font-semibold">
                        {navigationItems.map((item) => (
                            <div key={item.id}>
                                {!item.visible && null}
                                {item.visible &&
                                    <div className={item.children ? "relative group" : ""}>
                                        {item.enabled && item.children && item.showChildren ? (
                                            <div>
                                                <button
                                                    className="flex items-center gap-1 hover:text-accent transition-colors duration-100 ease-in-out hover:scale-105"
                                                    onClick={(e) => {
                                                        if (isTouchDevice) {
                                                            e.stopPropagation();
                                                            setExpandedItems({ [item.id]: !expandedItems[item.id] });
                                                        }
                                                    }}
                                                    aria-haspopup="true"
                                                    type="button"
                                                >
                                                    {item.label}
                                                    <SVGIcon
                                                        path={svgIcons.down as string}
                                                        className={`h-4 w-4 transition-transform duration-200 ${expandedItems[item.id] && isTouchDevice ? "rotate-180" : ""} group-hover:rotate-180`}
                                                    />
                                                </button>
                                                <div
                                                    className={`
                                                        absolute top-full left-0 mt-1 w-48 bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 border border-theme rounded-md shadow-lg
                                                        transition-all duration-200
                                                        ${item.children && (expandedItems[item.id] ? "opacity-100 visible" : "opacity-0 invisible")}
                                                        group-hover:opacity-100 group-hover:visible
                                                    `}
                                                    tabIndex={-1}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <div className="py-2">
                                                        {item.children.map((child, index) => (
                                                            <div className={`flex items-center justify-between text-zinc-800 dark:text-zinc-50 hover:bg-green-50 dark:hover:bg-slate-900 hover:text-green-600`} key={child.id}>
                                                                <Link
                                                                    key={child.id}
                                                                    href={child.enabled ? child.href : "#"}
                                                                    className={`${!child.enabled ? "opacity-40 cursor-not-allowed" : ""} block px-4 py-2 text-sm ${child.color === "none" && index === 0 ? "underline" : ""}`}
                                                                    onClick={() => setExpandedItems({})}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                                <div
                                                                    className={`${!child.enabled ? "opacity-40" : ""} w-2 h-2 rounded-full mr-3 ${child.color === "green"
                                                                        ? "bg-green-400"
                                                                        : child.color === "red"
                                                                            ? "bg-red-400"
                                                                            : child.color === "yellow"
                                                                                ? "bg-yellow-400"
                                                                                : child.color === "emerald"
                                                                                    ? "bg-emerald-400"
                                                                                    : child.color === "orange"
                                                                                        ? "bg-orange-400"
                                                                                        : child.color === "none"
                                                                                            ? ""
                                                                                            : "bg-blue-400"
                                                                        }`}
                                                                ></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.enabled ? item.href : "#"}
                                                className={`hover:text-accent transition-colors duration-100 ease-in-out hover:scale-105 ${!item.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </div>
                                }
                            </div>
                        ))}
                    </nav>

                    {/* Desktop Right Section - Logo */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="/">
                            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-50">{company.name}</span>
                        </Link>
                    </div>

                    {/* ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ Desktop ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ */}

                    {/* ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Mobile ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ */}
                    <div className="flex items-center justify-between w-full lg:hidden">
                        <div className="ml-1 p-1">
                            <HamburgerButton mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                        </div>
                        {/* Logo and Company Name (center) */}
                        <div className="flex flex-row items-center mx-auto text-zinc-800 dark:text-zinc-50 mr-2 p1">
                            {/* <div className="p-2 rounded-lg">
                                <Avatar alt={company.logoAlt} src={company.logo} sx={{ width: 24, height: 24 }} />
                            </div> */}
                            <span className="text-xl font-bold">{company.name}</span>
                        </div>
                        {/* Profile Icon (Mobile) */}
                        {/* <div className="mr-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMobileProfile();
                                }}
                                className="rounded-full hover:ring-2 hover:ring-accent transition-all duration-200"
                                aria-label="Toggle profile"
                            >
                                <Avatar
                                    alt={currentUser.name}
                                    src={currentUser.avatar}
                                    sx={{ width: 32, height: 32 }}
                                />
                            </button>
                        </div> */}
                    </div>

                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 bg-opacity-50 z-91 lg:hidden"
                                onClick={() => setMobileMenuOpen(false)}
                            />

                            <div className="fixed top-16 left-0 right-0 bottom-0 bg-green-50 dark:bg-slate-950 h-screen z-90 lg:hidden overflow-y-auto">
                                <div className="px-4 py-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 border border-theme mx-6 mt-4 rounded-2xl shadow-xl opacity-95">
                                    {/* Profile Section at Top */}
                                    <div
                                        className="flex items-center gap-3 p-4 bg-primary-bg border border-theme rounded-xl mb-4 cursor-pointer hover:scale-[1.02] transition-transform shadow-inner"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setMobileProfileOpen(true);
                                        }}
                                    >
                                        <Avatar
                                            alt={currentUser.name}
                                            src={currentUser.avatar}
                                            sx={{ width: 48, height: 48 }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-primary-text">
                                                {isLoggedIn ? currentUser.name : "Unknown User"}
                                            </p>
                                            {isLoggedIn && (
                                                <p className="text-xs text-secondary-text truncate">
                                                    {currentUser.email}
                                                </p>
                                            )}
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-secondary-text"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    <nav className="space-y-1">
                                        {navigationItems.map((item) => (
                                            <div key={item.id}>
                                                {item.visible && item.enabled && item.children ? (
                                                    <>
                                                        <button
                                                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-primary-text hover:bg-secondary-bg hover:text-accent rounded-md transition-colors"
                                                            onClick={() => toggleExpanded(item.id)}
                                                        >
                                                            <div className="flex items-center">
                                                                <div>{item.label}</div>
                                                                <div>
                                                                    {item.svgIcon && <SVGIcon path={item.svgIcon} className="mx-2 h-3.5 w-3.5 text-secondary-text" />}
                                                                </div>
                                                            </div>
                                                            <SVGIcon
                                                                path={svgIcons.down as string}
                                                                className={`h-5 w-5 text-secondary-text transition-transform duration-200 ${expandedItems[item.id] ? "rotate-180" : ""}`}
                                                            />
                                                        </button>

                                                        <div className={`overflow-hidden transition-all duration-300 ${expandedItems[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                                            <div className="ml-4 mt-1 space-y-1">
                                                                {item.children.map((child) => (
                                                                    child.visible && (
                                                                        <div className="ml-2 flex items-center" key={child.id + 'mobile'}>
                                                                            <div className={`w-2 h-2 ${child.color === "green"
                                                                                ? "bg-green-400"
                                                                                : child.color === "red"
                                                                                    ? "bg-red-400"
                                                                                    : child.color === "yellow"
                                                                                        ? "bg-yellow-400"
                                                                                        : child.color === "emerald"
                                                                                            ? "bg-emerald-400"
                                                                                            : child.color === "orange"
                                                                                                ? "bg-orange-400"
                                                                                                : "bg-blue-400"
                                                                                } rounded-full mr-3 ${!child.enabled ? "opacity-40" : ""}`}></div>
                                                                            <Link
                                                                                key={child.id}
                                                                                href={child.enabled ? child.href : "#"}
                                                                                className={`flex items-center px-3 py-2 text-sm text-secondary-text hover:bg-secondary-bg hover:text-accent rounded-md transition-colors ${!child.enabled ? "opacity-40 cursor-not-allowed" : ""} block px-4 py-2 text-sm font-mono`}
                                                                                onClick={() => setMobileMenuOpen(false)}
                                                                            >
                                                                                {child.label}
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    item.visible && <Link
                                                        href={item.enabled ? item.href : "#"}
                                                        className={`flex items-center px-3 py-2 text-sm font-semibold text-primary-text hover:bg-secondary-bg hover:text-accent rounded-md transition-colors ${!item.enabled ? "opacity-30 cursor-not-allowed" : ""}`}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {item.icon && <SVGIcon path={item.icon} className="mr-3 h-5 w-5 text-secondary-text" />}
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </>
                    )}
                    {/* ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ Mobile ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ */}
                </div>
            </header>

            {/* Profile Overlays */}
            <ProfileOverlay
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={currentUser}
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
                actionButtons={actionButtons}
            />

            <MobileProfileModal
                isOpen={mobileProfileOpen}
                onClose={() => setMobileProfileOpen(false)}
                user={currentUser}
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
                actionButtons={actionButtons}
            />
        </>
    );
}