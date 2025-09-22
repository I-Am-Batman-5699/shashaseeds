"use client";

import { useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import productsData from "../../../public/models/products/products.json";
import featureToggles from "../../../public/models/feature/feature-toggle.json";
import { motion, AnimatePresence } from 'framer-motion';
import { ProductProps, Product, Filters } from '@/types/products/products';
import { createPortal } from "react-dom";

interface ClickOutsideEvent {
    target: EventTarget | null;
}

// Use the feature toggle JSON for dynamic options
const availableFilters = featureToggles["products-page"].filters.availableOptions;
const sortOptionsMap = featureToggles["products-page"].sort.availableOptions;

const productsjson: ProductProps = productsData as ProductProps;
const products = productsjson.products || [];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState(featureToggles["products-page"].sort.defaultSortBy);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const sortButtonRef = useRef<HTMLDivElement | null>(null);
    const filterPanelRef = useRef<HTMLDivElement | null>(null);

    const [sortRect, setSortRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent & ClickOutsideEvent) => {
            if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
                setIsSortPopoverOpen(false);
            }
            if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
                setIsFilterPanelOpen(false);
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
    }, []);

    const getFilteredProducts = (products: Product[], searchTerm: string) => {
        if (!searchTerm) return products;
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    };

    const getSortedProducts = (productsArr: Product[], sortOption: string) => {
        const sorted = [...productsArr];
        switch (sortOption) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                sorted.sort((a, b) => {
                    if (a.rating && b.rating) {
                        return b.rating - a.rating;
                    }
                    return (a.id || '').localeCompare(b.id || '');
                });
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'id-asc':
                sorted.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
                break;
        }
        return sorted;
    };

    const getFilteredByAttributes = (products: Product[], filters: Filters) => {
        return products.filter((product) => {
            for (const key in filters) {
                const filterValue = filters[key as keyof typeof filters];
                if (filterValue !== null) {
                    // Check for the 'available' filter which is a top-level property
                    if (key === 'available') {
                        if (product.available !== filterValue) {
                            return false;
                        }
                    }
                    // Check for the 'rating' filter
                    else if (key === 'rating') {
                        const numericValue = parseFloat(filterValue as string);
                        if (product.rating === undefined || product.rating < numericValue) {
                            return false;
                        }
                    }
                    // Check for other filters (type, organic)
                    else {
                        if (product.filters && product.filters[key as keyof typeof product.filters] !== filterValue) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
    };

    const handleFilterChange = (filterKey: string, value: string | boolean) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterKey]: prev[filterKey as keyof typeof prev] === value ? null : value,
        }));
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

    const isFilterActive = Object.values(selectedFilters).some((v) => v !== null && v !== undefined);
    const isSortActive = sortOption !== featureToggles["products-page"].sort.defaultSortBy;

    const visibleProducts = getFilteredProducts(products, searchTerm);
    const sortedProducts = getSortedProducts(visibleProducts, sortOption);
    const finalProducts = getFilteredByAttributes(sortedProducts, selectedFilters as Filters);

    const Portal = ({ children }: { children: React.ReactNode }) => {
        if (typeof document === "undefined") return null;
        return createPortal(children, document.body);
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="mx-auto max-w-[90%] md:pb-8 pb-4 md:pt-4 pt-1">
                <div className="rounded-2xl shadow-xl md:p-4 p-2 inset-shadow-sm inset-shadow-indigo-200/50 space-y-1">
                    <div className="container mx-auto p-4">
                        <p className='md:text-2xl lg:text-3xl font-semibold text-gray-700 m-2 text-center'>
                            {productsjson.title || 'Our Products'}
                        </p>

                        {/* Search, Sort, and Filter Controls */}
                        <div className="flex flex-col p-1 md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 relative backdrop-blur-xl bg-opacity-70 rounded-xl">
                            {featureToggles["products-page"].sections.searchBar && (
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="border border-blue-300 rounded-full px-4 py-2 w-full md:w-1/3 shadow-md focus:ring-2 focus:ring-blue-500 transition-all text-zinc-950 inset-shadow-sm inset-shadow-green-100 outline-transparent focus:outline-2 focus:outline-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            )}
                            <div className="flex items-center space-x-4">
                                {/* Sort Button */}
                                {featureToggles["products-page"].sections.sortControls && (
                                    <div className="relative group" ref={sortButtonRef}>
                                        <button
                                            onClick={toggleSort}
                                            className={`relative border rounded-full p-2 shadow-sm transition-colors ${isSortActive ? 'border-blue-50 bg-blue-500 text-white' : 'border-gray-300 hover:bg-blue-100'}`}
                                            aria-label="Change sort"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke={isSortActive ? "white" : "#155dfc"} fill="none">
                                                <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 pointer-events-none z-30">
                                            {sortOptionsMap[sortOption as keyof typeof sortOptionsMap]}
                                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 rotate-45 bg-gray-800 -mb-1 overflow-x-auto"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Filter Button */}
                                {featureToggles["products-page"].sections.filterControls && (
                                    <button
                                        onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                        className={`border rounded-full p-2 shadow-sm transition-colors ${isFilterActive ? 'border-blue-50 bg-blue-500' : 'border-gray-300 hover:bg-blue-100'
                                            }`}
                                        aria-label="Open filter panel"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFilterActive ? "#ffffff" : "#155dfc"} viewBox="0 0 24 24" stroke={isFilterActive ? "#ffffff" : "#155dfc"} strokeWidth="0.1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"></path></svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Portaled Sort Popover */}
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
                                        left: Math.max(8, sortRect.left + window.scrollX + (sortRect.width / 2) - 96), // center-ish
                                        width: 192,
                                        zIndex: 9999,
                                    }}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <ul className="py-2">
                                        {Object.entries(sortOptionsMap).map(([key, value]) => (
                                            <li
                                                key={key}
                                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${sortOption === key ? 'bg-blue-100 font-semibold text-blue-800' : 'font-normal text-zinc-800'}`}
                                                onClick={() => handleSortChange(key)}
                                            >
                                                {value}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </Portal>
                        )}

                        {/* Filter Panel (opens from right) */}
                        <AnimatePresence>
                            {isFilterPanelOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 bg-opacity-50 z-40"
                                        onClick={() => setIsFilterPanelOpen(false)}
                                    />
                                    {/* Filter Panel */}
                                    <motion.div
                                        ref={filterPanelRef}
                                        initial={{ x: '100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '100%' }}
                                        transition={{ type: 'tween', duration: 0.3 }}
                                        className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto text-zinc-900"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z" />
                                            </svg>
                                            <p className="text-2xl font-bold text-center">Filters</p>
                                            <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        {Object.entries(availableFilters).map(([key, filterData]) => {
                                            if (filterData.enabled) {
                                                return (
                                                    <div key={key} className="mb-4">
                                                        <p className="font-semibold text-lg capitalize mb-2">{key}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {filterData.options.map((value) => (
                                                                <button
                                                                    key={value.toString()}
                                                                    onClick={() => handleFilterChange(key, value as string | boolean)}
                                                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedFilters[key as keyof typeof selectedFilters] === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                                                >
                                                                    {value.toString()}
                                                                </button>
                                                            ))}
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


                        <hr className='mb-2 -mt-4' />

                        {/* Products Grid */}
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
                                    <h2 className="text-xl font-semibold mb-2">No items found</h2>
                                    <p>Please adjust your filters or search terms.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}