"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

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
  const category = Array.isArray(params?.category) ? params.category[0] : (params?.category ?? "");
  const productName = Array.isArray(params?.productName) ? params.productName[0] : (params?.productName ?? "");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // for thumbnail scroll
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/products.json");
        const data: Product[] = await res.json();
        const found = data.find(p => slugify(p.name) === productName && p.category === category);
        if (found) {
          setProduct(found);
          setMainImage(found.images?.[0] ?? null);
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, productName]);

  function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }

  const scrollThumbs = (dir: "up" | "down") => {
    if (!thumbsRef.current) return;
    const el = thumbsRef.current;
    const offset = dir === "up" ? -80 : 80;
    el.scrollBy({ top: offset, behavior: "smooth" });
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[40%_60%]">
        {/* LEFT: images (40% on md+, full width on small) */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex gap-4">
            {/* thumbnails vertical */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <button onClick={() => scrollThumbs("up")} className="p-1 rounded bg-gray-100">▲</button>
              <div ref={thumbsRef} className="flex flex-col gap-2 overflow-y-auto max-h-96">
                {(product.images ?? []).map((src, i) => (
                  <button key={i} onClick={() => setMainImage(src)} className={`w-16 h-16 p-1 rounded border ${mainImage === src ? "ring-2 ring-green-500" : ""}`}>
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button onClick={() => scrollThumbs("down")} className="p-1 rounded bg-gray-100">▼</button>
            </div>

            {/* main image */}
            <div className="flex-1">
              {mainImage ? (
                <div className="w-full h-96 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  <img src={mainImage} alt={product.name} className="max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-50 rounded flex items-center justify-center">No image</div>
              )}

              {/* small thumbnails for mobile */}
              <div className="mt-3 flex gap-2 md:hidden overflow-x-auto">
                {(product.images ?? []).map((src, i) => (
                  <button key={i} onClick={() => setMainImage(src)} className={`w-16 h-12 p-1 rounded border ${mainImage === src ? "ring-2 ring-green-500" : ""}`}>
                    <img src={src} alt={`thumb-mobile-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-white border rounded">Wishlist</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded">Add to cart</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: details (60% on md+, stacked below on small) */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.sku || product.id}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-2xl font-bold">₹{product.price?.toFixed(2)}</div>
            {product.discount ? <div className="text-sm text-rose-600">-{product.discount}%</div> : null}
            <div className="text-sm text-gray-500">Rating: {product.rating ?? "—"}</div>
          </div>

          <div className="mt-4 text-gray-700">
            <p>{product.description}</p>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Details</h4>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {product.attributes && Object.entries(product.attributes).map(([k, v]) => (
                <li key={k}><strong>{k}:</strong> {String(v)}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <label className="block text-sm">Quantity</label>
            <input type="number" defaultValue={1} min={1} className="mt-2 px-3 py-2 border rounded w-24" />
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 border rounded">Add to cart</button>
            <button className="px-4 py-2 bg-white border rounded">Wishlist</button>
          </div>

          <div className="mt-6 flex gap-2 text-sm">
            {product.tags?.map(t => <span key={t} className="px-2 py-1 bg-gray-100 rounded">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
