'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Search } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductsPage() {
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const [search, setSearch] = useState('');

  const filtered = products?.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = products
    ? [...new Set(products.map((p: any) => p.category))]
    : [];

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12 pt-8">
            <span className="badge mb-4 inline-block">📦 CATALOG</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Semua <span className="text-accent">Produk</span>
            </h1>
            <p className="text-vanilla/40 max-w-lg mx-auto">
              Jelajahi koleksi source code website premium kami. Setiap produk dilengkapi video tutorial.
            </p>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-vanilla/30" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-glass pl-11 py-3.5 rounded-2xl w-full"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Categories */}
        {categories.length > 0 && (
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setSearch('')}
                className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                  search === ''
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'glass text-vanilla/50 hover:text-vanilla'
                }`}
              >
                Semua
              </button>
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSearch(cat)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                    search === cat
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'glass text-vanilla/50 hover:text-vanilla'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-vanilla/30">Memuat produk...</p>
          </div>
        )}

        {/* Products Grid */}
        {filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filtered.map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {filtered && filtered.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-vanilla/20 mb-4" />
            <p className="text-vanilla/30 mb-2">Tidak ada produk ditemukan.</p>
            <p className="text-vanilla/20 text-sm">
              {search ? 'Coba kata kunci lain.' : 'Produk akan segera tersedia.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}