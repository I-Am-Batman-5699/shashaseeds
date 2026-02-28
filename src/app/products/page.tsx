"use client";
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { ProductProps, Product } from '@/types/products/products';
import { createPortal } from "react-dom";
import { FetchItems } from "@/lib/fetcher";
import AIDNALoader from '@/components/loaders/ClosedAIDNA';
import { FeatureToggleProps, ProductsPage as ProductsPageProps } from '@/types/featureToggle';

interface ClickOutsideEvent extends MouseEvent {
    target: EventTarget | null;
}

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [config, setConfig] = useState<ProductsPageProps>();
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('id-asc');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const urlFilterKeyMap = useMemo(() => ({
        category: {
            filterKey: 'type',
            transform: (value: string) => value.replace(/-seeds$/, ''),
        },
        organic: {
            filterKey: 'organic',
            transform: (value: string) => value === 'true',
        },
        available: {
            filterKey: 'available',
            transform: (value: string) => value === 'true',
        },
    }), []);

    const parseUrlFilters = useCallback((params: ReadonlyURLSearchParams) => {
        const initialFilters: Record<string, string | boolean | undefined> = {};

        Object.keys(urlFilterKeyMap).forEach((urlKey) => {
            const urlValue = params.get(urlKey);
            if (urlValue !== null) {
                const { filterKey, transform } =
                    urlFilterKeyMap[urlKey as keyof typeof urlFilterKeyMap];
                initialFilters[filterKey] = transform(urlValue);
            }
        });

        return initialFilters;
    }, [urlFilterKeyMap]);

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string | boolean | undefined>>(() =>
        parseUrlFilters(searchParams)
    );

    const sortButtonRef = useRef<HTMLDivElement | null>(null);
    const filterPanelRef = useRef<HTMLDivElement | null>(null);

    const [sortRect, setSortRect] = useState<DOMRect | null>(null);
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [productsResult, featuresResult] = await Promise.all([
                    FetchItems({ path: "/models/products/products.json" }),
                    FetchItems({ path: "/models/feature/feature-toggle.json" }),
                ]);

                if (productsResult.error || productsResult.status === "E") {
                    console.error("Error fetching products:", productsResult.error);
                }

                const productsResponse = productsResult.data as ProductProps | null;
                setProducts(productsResponse?.products || []);

                if (featuresResult.error || featuresResult.status === "E") {
                    console.error("Error fetching features config:", featuresResult.error);
                }

                const featuresResponse = featuresResult.data as FeatureToggleProps;
                const pageConfig = featuresResponse?.["products-page"];

                setConfig(pageConfig || null);

                if (pageConfig?.sort?.defaultSortBy) {
                    setSortOption(pageConfig.sort.defaultSortBy);
                }

            } catch (error) {
                console.error("Critical error during data loading process:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const newUrlFilters = parseUrlFilters(searchParams);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setSelectedFilters(prev => ({
            // ...prev,
            ...newUrlFilters
        }));
    }, [searchParams, parseUrlFilters]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const mouseEvent = event as ClickOutsideEvent;

            if (isSortPopoverOpen && sortButtonRef.current && !sortButtonRef.current.contains(mouseEvent.target as Node)) {
                setIsSortPopoverOpen(false);
            }
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSortPopoverOpen(false);
                setIsFilterPanelOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener("keydown", onKey);
        };
    }, [isSortPopoverOpen]);

    const getFilteredByAttributes = (productsArr: Product[], filters: Record<string, string | boolean | undefined>) => {
        return productsArr.filter((product) => {
            for (const key in filters) {
                const filterValue = filters[key as keyof typeof filters];

                if (filterValue === null || filterValue === undefined) continue;

                if (key === 'available') {
                    if (product.available !== filterValue) {
                        return false;
                    }
                    continue;
                }

                if (key === 'rating') {
                    const numericValue = parseFloat(filterValue as string);
                    if (product.rating === undefined || product.rating < numericValue) {
                        return false;
                    }
                    continue;
                }

                if (product.filters) {
                    const productFilterValue = product.filters[key as keyof typeof product.filters];
                    if (productFilterValue !== undefined && productFilterValue !== filterValue) {
                        return false;
                    }
                }
                else if (!product.filters || product.filters[key as keyof typeof product.filters] === undefined) {
                    return false;
                }
            }
            return true;
        });
    };

    const getSearchedProducts = (products: Product[], searchTerm: string) => {
        if (!searchTerm) return products;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return products.filter((product) => {
            const searchMatch = product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)));
            return searchMatch;
        });
    };

    const getSortedProducts = (productsArr: Product[], sortOption: string) => {
        const sorted = [...productsArr];
        switch (sortOption) {
            case 'price-asc':
                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating-desc':
                sorted.sort((a, b) => (b.rating || -1) - (a.rating || -1));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                break;
            case 'id-asc':
            default:
                sorted.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
                break;
        }
        return sorted;
    };

    const handleFilterChange = (filterKey: string, value: string | boolean) => {
        setSelectedFilters((prev) => {
            const currentValue = prev[filterKey as keyof typeof prev];
            const newValue = currentValue === value ? undefined : value;

            return {
                ...prev,
                [filterKey]: newValue,
            };
        });
    };

    const toggleSort = () => {
        if (!isSortPopoverOpen && sortButtonRef.current) {
            setSortRect(sortButtonRef.current.getBoundingClientRect());
        }
        setIsSortPopoverOpen(v => !v);
    };

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setIsSortPopoverOpen(false);
    };

    const productsPageConfig = (config || {}) as ProductsPageProps;
    const availableFilters = productsPageConfig.filters?.availableOptions || {};
    const sortOptionsMap = productsPageConfig.sort?.availableOptions || {};
    const defaultSortBy = productsPageConfig.sort?.defaultSortBy || 'id-asc';
    const productsPageData = productsPageConfig.displayData || {};

    const isFilterActive = Object.values(selectedFilters).some(v => v !== null && v !== undefined);

    const isSortActive = sortOption !== defaultSortBy;

    const finalProducts = useMemo(() => {
        const searched = getSearchedProducts(products, searchTerm);
        const filtered = getFilteredByAttributes(searched, selectedFilters);
        const sorted = getSortedProducts(filtered, sortOption);
        return sorted;
    }, [products, searchTerm, selectedFilters, sortOption]);

    const Portal = ({ children }: { children: React.ReactNode }) => {
        if (!isMounted || typeof document === "undefined") return null;
        return createPortal(children, document.body);
    };

    const pageTitle = categoryFromUrl
        ? categoryFromUrl.replace(/-/g, ' ').toUpperCase()
        : (productsPageData.defaultTitle || "PRODUCTS");


    if (isLoading || !config) {
        return (
            <div className=" bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 min-h-[90vh] flex items-center justify-center">
                <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                    <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm dark:inset-shadow-indigo-900/50 space-y-1">
                        <AIDNALoader />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950">
            <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm dark:inset-shadow-indigo-900/50 space-y-1">
                    <div className="container mx-auto p-4">
                        <p className='md:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-200 m-2 text-center'>
                            {pageTitle}
                        </p>

                        {/* Search, Sort, and Filter Controls Section */}
                        <div className="flex flex-col p-1 md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 relative backdrop-blur-xl bg-opacity-70 rounded-xl">
                            {productsPageConfig.sections.searchBar && (
                                <input
                                    type="text"
                                    placeholder={productsPageData.searchPlaceholder}
                                    className="border border-blue-300 rounded-full px-4 py-2 w-full md:w-1/3 shadow-md transition-all text-zinc-950 dark:text-green-50 inset-shadow-xs inset-shadow-green-100/50 outline-transparent focus:outline-1 focus:outline-cyan-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            )}
                            <div className="flex items-center space-x-4">
                                {/* Sort Button Section */}
                                {productsPageConfig.sections.sortControls && (
                                    <div className="relative group" ref={sortButtonRef}>
                                        <button
                                            onClick={toggleSort}
                                            className={`border relative rounded-full p-2 shadow-sm transition-colors ${isSortActive ? 'border-blue-50 bg-blue-950 dark:bg-blue-700 text-green-50' : ' hover:bg-blue-100 border border-theme-reverse'}`}
                                            aria-label={productsPageData.sortButtonAriaLabel}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke={isSortActive ? "white" : "#6f788b"} fill="none">
                                                <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>
                                        {/* <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 pointer-events-none z-30">
                                            {sortOptionsMap[sortOption as keyof typeof sortOptionsMap]}
                                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 rotate-45 bg-gray-800 -mb-1 overflow-x-auto"></div>
                                        </div> */}
                                    </div>
                                )}

                                {/* Filter Button Section */}
                                {productsPageConfig.sections.filterControls && (
                                    <button
                                        onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                        className={`border rounded-full p-2 shadow-sm transition-colors ${isFilterActive ? 'border-blue-50 bg-blue-950 dark:bg-blue-700 text-green-50' : 'hover:bg-blue-100 border border-theme-reverse'}`}
                                        aria-label={productsPageData.filterButtonAriaLabel}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFilterActive ? "#ffffff" : "#6f788b"} viewBox="0 0 24 24" stroke={isFilterActive ? "#ffffff" : "#6f788b"} strokeWidth="0.1">
                                            <path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Portaled Sort Popover Section */}
                        <AnimatePresence>
                            {isSortPopoverOpen && sortRect && typeof document !== "undefined" && (
                                <Portal>
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.12 }}
                                        style={{
                                            position: "absolute",
                                            top: (sortRect.bottom + window.scrollY + 8),
                                            left: Math.max(8, sortRect.left + window.scrollX + (sortRect.width / 2) - 96),
                                            width: 192,
                                            zIndex: 9999,
                                        }}
                                        className="bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 border border-theme rounded-lg shadow-lg overflow-hidden"
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <ul className="py-2">
                                            {Object.entries(sortOptionsMap).map(([key, value]) => (
                                                <li
                                                    key={key}
                                                    className={`px-4 py-2 text-zinc-800 dark:text-zinc-50 hover:bg-green-50 dark:hover:bg-slate-900 hover:text-green-600 cursor-pointer text-sm ${sortOption === key ? 'bg-blue-100 dark:bg-blue-950 font-semibold text-blue-800' : 'font-normal text-zinc-800'}`}
                                                    onClick={() => handleSortChange(key)}
                                                >
                                                    {value as string}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </Portal>
                            )}
                        </AnimatePresence>

                        {/* Filter Panel (Slide-in from right) Section */}
                        <AnimatePresence>
                            {isFilterPanelOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        exit={{ opacity: 0 }}
                                        className={`fixed inset-0 bg-gradient-to-br from-green-50/40 to-green-100/40 dark:from-slate-900/40 dark:to-slate-950/40 z-[68] backdrop-blur-sm transition-opacity duration-300 ${isFilterPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                        onClick={() => setIsFilterPanelOpen(false)}
                                    />
                                    {/* Filter Panel Content */}
                                    <motion.div
                                        ref={filterPanelRef}
                                        initial={{ x: '100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '100%' }}
                                        transition={{ type: 'tween', duration: 0.3 }}
                                        className="fixed inset-y-0 right-0 w-80 bg-gradient-to-br from-green-50 to-green-100 text-zinc-800 dark:from-slate-900 dark:to-slate-950 dark:text-zinc-50 border border-theme z-69 p-6 overflow-y-auto mt-18 mb-2 rounded-2xl shadow-2xl mr-1"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z" />
                                            </svg>
                                            <p className="text-2xl font-bold text-center">{productsPageData.filterPanelTitle}</p>
                                            <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label={productsPageData.closeFilterPanelAriaLabel}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <hr className='-mt-4 mb-2' />

                                        {/* Dynamic Filter Options Mapping */}
                                        {Object.entries(availableFilters).map(([key, filterData]) => {
                                            if (filterData.enabled) {

                                                const simplifiedUrlValue = categoryFromUrl
                                                    ? categoryFromUrl.replace(/-seeds$/, '')
                                                    : undefined;

                                                const isUrlFilterActive = (key === 'type' && simplifiedUrlValue);

                                                const urlLockedValue = selectedFilters[key as keyof typeof selectedFilters];

                                                const isFilterKeyUrlLocked =
                                                    Object.values(urlFilterKeyMap).some(map => map.filterKey === key)
                                                    && urlLockedValue !== null
                                                    && urlLockedValue !== undefined;

                                                return (
                                                    <div key={key} className="mb-4">
                                                        <p className="font-semibold text-lg capitalize mb-2">
                                                            {productsPageData.filterDisplayNames?.[key as keyof typeof productsPageData.filterDisplayNames] || key}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2">
                                                            {filterData.options.map((value: string) => {

                                                                let isSelected = selectedFilters[key as keyof typeof selectedFilters] === value;
                                                                let isDisabled = false;

                                                                if (isUrlFilterActive && isFilterKeyUrlLocked) {
                                                                    if (value !== urlLockedValue) {
                                                                        return null;
                                                                    }

                                                                    isSelected = true;
                                                                    isDisabled = true;
                                                                }

                                                                if (isUrlFilterActive && value === simplifiedUrlValue) {
                                                                    isSelected = true;
                                                                    isDisabled = true;
                                                                }

                                                                const specificDisplayKey = `${key}-${value.toString()}`;

                                                                const optionText = productsPageData.filterOptionDisplayNames?.[specificDisplayKey as keyof typeof productsPageData.filterOptionDisplayNames]
                                                                    || productsPageData.filterOptionDisplayNames?.[value.toString() as keyof typeof productsPageData.filterOptionDisplayNames]
                                                                    || value.toString();

                                                                return (
                                                                    <button
                                                                        key={value.toString()}
                                                                        onClick={isDisabled ? undefined : () => handleFilterChange(key, value as string | boolean)}
                                                                        className={`
                                                                            px-3 py-1 text-sm rounded-full border transition-colors capitalize
                                                                            ${isSelected ? 'bg-blue-900 hover:bg-blue-700 text-white border-blue-600' : 'bg-white dark:bg-zinc-950 border-gray-300 text-zinc-800 dark:text-zinc-50 hover:bg-green-50 dark:hover:bg-slate-900 hover:text-green-600 dark:hover:bg-'}
                                                                            ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''} 
                                                                        `}
                                                                        disabled={isDisabled as boolean}
                                                                    >
                                                                        {optionText}
                                                                        {/* {isDisabled && ` (${productsPageData.fixedFilterLabel})`} */}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>


                        <div className="h-px border-t border-reverse-theme" />

                        {/* Products Grid Section */}
                        <div className="mt-4">
                            {finalProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {finalProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <svg
                                        className="w-24 h-24 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0a2 2 0 002-2"
                                        />
                                    </svg>
                                    <h2 className="text-xl font-semibold mb-2">{productsPageData.noItemsFoundTitle}</h2>
                                    <p>{productsPageData.noItemsFoundMessage}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<AIDNALoader />}>
            <ProductsPageContent />
        </Suspense>
    );
}