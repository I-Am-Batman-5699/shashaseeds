"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  available?: boolean;
  enabled?: boolean;
  visible?: boolean;
  new?: boolean;
  sale?: boolean;
  images?: string[];
  description?: string;
  sku?: string;
  tags?: string[];
  createdAt?: string;
  searchKeywords?: string[];
};

export default function CategoryPage() {
  const params = useParams();
  const category = Array.isArray(params?.category) ? params.category[0] : (params?.category ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state similar to main page
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating" | "new">("popular");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/products.json");
        const data: Product[] = await res.json();
        // pre-filter by category and visibility/enabled
        setProducts(data.filter(p => p.category === category && p.enabled !== false && p.visible !== false));
      } catch (e) {
        console.error("Failed to load products.json", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = products.slice();
    if (q) {
      res = res.filter(p =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.searchKeywords || []).some(k => k.toLowerCase().includes(q))
      );
    }
    if (selectedTags.length) {
      res = res.filter(p => selectedTags.every(t => p.tags?.includes(t)));
    }
    if (filterAvailable !== null) res = res.filter(p => Boolean(p.available) === filterAvailable);
    if (priceMin !== "") res = res.filter(p => p.price >= Number(priceMin));
    if (priceMax !== "") res = res.filter(p => p.price <= Number(priceMax));
    switch (sort) {
      case "price-asc":
        res.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-desc":
        res.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "new":
        res.sort((a, b) => (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())); break;
      default: break;
    }
    return res;
  }, [products, query, selectedTags, filterAvailable, priceMin, priceMax, sort]);

  function ProductCard({ p }: { p: Product }) {
    const mainImg = p.images?.[0] ?? "/placeholder.svg";
    return (
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Link href={`/products/${encodeURIComponent(p.category)}/${slugify(p.name)}`} className="block">
          <div className="relative w-full h-44 overflow-hidden bg-gray-100">
            <img src={mainImg} alt={p.name} className="w-full h-full object-contain p-4" />
            {p.new && <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">NEW</span>}
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-xs text-muted-foreground">{p.sku || p.id}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-lg font-bold">₹{p.price?.toFixed(2)}</div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{category.replace(/[-_]/g, " ")}</h1>
        <div className="hidden md:flex items-center gap-3">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search this category..." className="px-3 py-2 border rounded w-64" />
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="px-3 py-2 border rounded">
            <option value="popular">Sort: Popular</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[40%_60%]">
        <aside className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold mb-2">Filters in {category}</h4>
          <div className="mb-3">
            <label className="block text-sm font-medium">Availability</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setFilterAvailable(null)} className="px-2 py-1 rounded bg-gray-50">Any</button>
              <button onClick={() => setFilterAvailable(true)} className="px-2 py-1 rounded bg-gray-50">In stock</button>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allTags.map(tag => {
                const active = selectedTags.includes(tag);
                return (
                  <button key={tag} onClick={() => setSelectedTags(prev => active ? prev.filter(t => t !== tag) : [...prev, tag])} className={`px-2 py-1 text-sm rounded border ${active ? "bg-green-600 text-white" : ""}`}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main>
          {loading ? <div>Loading...</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} p={p} />)}
              {filtered.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">No products found in {category}.</div>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
