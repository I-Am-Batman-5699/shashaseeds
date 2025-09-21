'use client';

// pages/products.tsx
import { useState, useEffect } from 'react';
import ProductCard from '@/components/cards/ProductCard';
import productsData from "../../../public/models/products/products.json";
import { motion, AnimatePresence } from 'framer-motion';

const getFilteredProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

const getSortedProducts = (products, sortOption) => {
  const sorted = [...products];
  switch (sortOption) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      break;
  }
  return sorted;
};

const getFilteredByAttributes = (products, filters) => {
  return products.filter((product) => {
    // Check if the product matches all selected filters
    for (const key in filters) {
      if (filters[key] !== null) {
        if (product.filters[key] !== filters[key]) {
          return false;
        }
      }
    }
    return true;
  });
};

const availableFilters = {
  type: ['flower', 'vegetable', 'fruit', 'herb'],
  organic: [true, false]
};

const products = productsData;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value,
    }));
  };

  const visibleProducts = getFilteredProducts(products, searchTerm);
  const sortedProducts = getSortedProducts(visibleProducts, sortOption);
  const finalProducts = getFilteredByAttributes(sortedProducts, selectedFilters);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
      
      {/* Search, Sort, and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 relative">
        <input
          type="text"
          placeholder="Search products..."
          className="border rounded-full px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-full px-4 py-2 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="border rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Open filter panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Panel (opens from right) */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {Object.keys(availableFilters).map((key) => (
              <div key={key} className="mb-4">
                <h3 className="font-semibold text-lg capitalize mb-2">{key}</h3>
                <div className="flex flex-wrap gap-2">
                  {availableFilters[key].map((value) => (
                    <button
                      key={value.toString()}
                      onClick={() => handleFilterChange(key, value)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedFilters[key] === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {value.toString()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {finalProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}