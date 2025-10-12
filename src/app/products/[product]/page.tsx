"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import productsData from "../../../../public/models/products/products.json";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  available?: boolean;
  images?: string[];
  description?: string;
  sku?: string;
  rating?: number;
  attributes?: Record<string, any>;
  tags?: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.product as string;  // Changed from productId to product to match the folder name

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // for thumbnail scroll
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    // Check if this is a category page
    const isCategory = ['herb-seeds', 'flower-seeds', 'vegetable-seeds', 'fruit-seeds', 'organic-collection'].includes(productId);
    
    if (isCategory) {
      // Redirect to products page with category filter
      window.location.href = `/products?category=${productId}`;
      return;
    }

    // If not a category, look for individual product
    const found = productsData.products.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      if (found.images && found.images.length > 0) {
        setMainImage(found.images[0]);
      }
    }
    setLoading(false);
  }, [productId]);

  const scrollThumbs = (dir: "up" | "down") => {
    if (!thumbsRef.current) return;
    const el = thumbsRef.current;
    const offset = dir === "up" ? -80 : 80;
    el.scrollBy({ top: offset, behavior: "smooth" });
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
      <a
        href="/products"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Browse All Products
      </a>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <a href="/products" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </a>

      <div className="grid gap-6 md:grid-cols-[40%_60%] bg-white rounded-xl p-6 shadow-lg">
        {/* LEFT: images (40% on md+, full width on small) */}
        <div className="flex gap-4">
          {/* thumbnails vertical */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <button 
              onClick={() => scrollThumbs("up")} 
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ▲
            </button>
            <div ref={thumbsRef} className="flex flex-col gap-2 overflow-y-auto max-h-96 scroll-smooth">
              {(product.images ?? []).map((src, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(src)} 
                  className={`w-16 h-16 p-1 rounded-lg border transition-all ${
                    mainImage === src 
                      ? "ring-2 ring-green-500 border-green-500" 
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <img src={src} alt={`${product.name} thumbnail ${i+1}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
            <button 
              onClick={() => scrollThumbs("down")} 
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ▼
            </button>
          </div>

          {/* main image */}
          <div className="flex-1">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* RIGHT: product info (60% on md+, full width on small) */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
          </div>

          <div className="flex items-baseline">
            {product.discount ? (
              <>
                <p className="text-3xl font-semibold text-gray-900">
                  ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                </p>
                <p className="ml-4 text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</p>
                <p className="ml-4 text-lg text-green-600">Save {product.discount}%</p>
              </>
            ) : (
              <p className="text-3xl font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
            )}
          </div>

          {product.description && (
            <div className="prose max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}