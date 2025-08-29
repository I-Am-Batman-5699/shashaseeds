"use client";


import Avatar from '@mui/material/Avatar';
import Link from "next/link";
import { useState } from "react";

// Import JSON data
import navigationData from "@/data/navigation.json";
import companyData from "@/data/company.json";
import uiElementsData from "@/data/ui-elements.json";
import icons from "@/data/icons.json";

// Import types
import { NavigationItem, ActionButton } from "@/types/navigation";

import HamburgerButton from "@/components/ui/hamburgerButton";
import SVGIcon from "@/components/ui/svgIcon";
import { Button } from "@/components/ui/button";

import useIsTouchDevice from '@/hooks/useIsTouchDevice';

export default function HeaderNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const navigationItems: NavigationItem[] = navigationData.navigationItems;
    const actionButtons: ActionButton[] = uiElementsData.actionButtons as ActionButton[];
    const company = companyData.companyInfo;
    const svgIcons = icons.svg;
    const isTouchDevice = useIsTouchDevice();

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    return (
        <header className="sticky lg:px-4 min-h-15  flex items-center top-0 justify-between z-50 border-b shadow-sm bg-gradient-to-r from-green-700 from-10% via-green-600 via-45% to-green-700 to-90% backdrop-blur-xl bg-opacity-70 border-green-200">

            {/* ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Desktop ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ */}

            {/* ⬇ Desktop Logo ⬇ */}
            <div className="items-center gap-1 md:m-1 p-1 hidden lg:flex text-zinc-50">
                <div className="rounded-lg">
                    <Avatar alt={company.logoAlt} src={company.logo} sx={{ width: 24, height: 24 }} />
                </div>
                <span className="text-xl font-bold">{company.name}</span>
            </div>
            {/* ⬆ Desktop Logo ⬆ */}

            {/* ⬇ Desktop navigation ⬇ */}
            <nav className="hidden lg:flex items-center gap-8 text-sm text-zinc-100 font-semibold">
                {navigationItems.map((item) => (
                    <div key={item.id} >
                        {!item.visible && null}
                        {item.visible &&
                            <div className={item.children ? "relative group" : ""}>
                                {item.enabled && item.children && item.showChildren ? (
                                    <div>
                                        <button
                                            className="flex items-center gap-1 hover:text-zinc-50 transition-colors duration-100 ease-in-out hover:scale-105"
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
                                                className={`h-4 w-4 transition-transform duration-200 ${expandedItems[item.id] && isTouchDevice ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        <div
                                            className={`
                                        absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg
                                        transition-all duration-200
                                        ${item.children && (expandedItems[item.id] ? "opacity-100 visible" : "opacity-0 invisible")}
                                        group-hover:opacity-100 group-hover:visible
                                    `}
                                            tabIndex={-1}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="py-2">
                                                {item.children.map((child) => (
                                                    <div className={`flex items-center justify-between text-zinc-700 hover:bg-green-50 hover:text-green-600`} key={child.id}>
                                                        <Link
                                                            key={child.id}
                                                            href={child.enabled ? child.href : "#"}
                                                            className={`${!child.enabled ? "opacity-40 cursor-not-allowed" : ""} block px-4 py-2 text-sm`}
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
                                        className={`hover:text-zinc-600 transition-colors duration-100 ease-in-out hover:scale-105 ${!item.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        }
                    </div>
                ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
                {actionButtons.map((button) => (
                    <Button
                        key={button.id}
                        variant={button.variant as any}
                        className={`${button.className} smallButton`}
                        asChild
                    >
                        <Link href={button.href || "#"}>
                            {button.label}
                        </Link>
                    </Button>
                ))}
                {/* #TODO For user profile*/}
                <div className='invisible w-8 hidden'>
                    <Avatar alt={company.logoAlt} src={company.logo} sx={{ width: 32, height: 32 }} />
                </div>
            </div>

            {/* ⬆ Desktop navigation ⬆ */}
            {/* ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ Desktop ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ */}

            {/* ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Mobile ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ */}
            {/* ⬇ Mobile Logo ⬇ */}
            <div className="flex items-center justify-between w-full lg:hidden">
                <div className="ml-1 p-1">
                    <HamburgerButton mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                </div>
                {/* Logo and Company Name (center) */}
                <div className="flex flex-row items-center mx-auto text-amber-50">
                    <div className="p-2 rounded-lg">
                        <Avatar alt={company.logoAlt} src={company.logo} sx={{ width: 24, height: 24 }} />
                    </div>
                    <span className="text-xl font-bold">{company.name}</span>
                </div>
                <div className="w-8">
                    {/* #TODO For user profile*/}
                    <div className='invisible w-8'>
                        <Avatar alt={company.logoAlt} src={company.logo} sx={{ width: 32, height: 32 }} />
                    </div>
                </div>
            </div>
            {/* ⬆ Mobile Logo ⬆ */}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-green-50 h-screen z-500 lg:hidden overflow-y-auto">
                        <div className="px-4 py-6 bg-white mx-6 mt-4 rounded-lg shadow-lg drop-shadow-2xl opacity-90">
                            <nav className="space-y-1">
                                {navigationItems.map((item) => (
                                    <div key={item.id}>
                                        {item.visible && item.enabled && item.children ? (
                                            <>
                                                <button
                                                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors"
                                                    onClick={() => toggleExpanded(item.id)}
                                                >
                                                    <div className="flex items-center">
                                                        <div>
                                                            {item.label}
                                                        </div>
                                                        <div>
                                                            {item.svgIcon && <SVGIcon path={item.svgIcon} className="mx-2 h-3.5 w-3.5 text-gray-800" />}
                                                        </div>
                                                    </div>
                                                    <SVGIcon
                                                        path={svgIcons.down as string}
                                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedItems[item.id] ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${expandedItems[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                        }`}
                                                >
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
                                                                        className={`flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors ${!child.enabled ? "opacity-40 cursor-not-allowed" : ""} block px-4 py-2 text-sm font-mono`}
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
                                                className={`flex items-center px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors ${!item.enabled ? "opacity-30 cursor-not-allowed" : ""}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.icon && <SVGIcon path={item.icon} className="mr-3 h-5 w-5 text-gray-400" />}
                                                {item.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
                                {actionButtons.map((button) => (
                                    <Button
                                        key={button.id}
                                        className={`mb-3 ${button.className}`}
                                        variant={button.variant as any}
                                        style={{ width: "15rem" }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        asChild
                                    >
                                        <Link href={button.href || "#"}>
                                            {button.icon && <SVGIcon path={button.icon} className="mr-2 h-4 w-4" />}
                                            {button.label}
                                        </Link>
                                    </Button>
                                ))}

                                <div className="text-center">
                                    <span className="text-sm text-gray-500">Need help?</span>
                                    <Link href="/support" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ Mobile ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ */}



        </header>
    );
}