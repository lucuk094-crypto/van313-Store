'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  Search, SlidersHorizontal, ArrowLeft, ChevronRight,
  Star, MessageCircle, TrendingUp, Tag,
  Monitor, Layout, BarChart3, ShoppingBag,
  FileCode, Palette, Cloud, Smartphone,
  Home, Grid3X3, ShoppingCart, Gift, User,
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const catIcons: Record<string, any> = {
  'Website Template': Monitor,
  'Landing Page': Layout,
  'Dashboard': BarChart3,
  'E-Commerce': ShoppingBag,
  'Blog': FileCode,
  'Portfolio': Palette,
  'SaaS': Cloud,
  'Mobile App': Smartphone,
};

const badges = [
  { label: 'BESTSELLER' },
  { label: 'TRENDING' },
  { label: 'POPULAR' },
  { label: 'NEW' },
];

export default function ProductsPage() {
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');

  const categories = products
    ? Array.from(new Set(products.map((p: any) => p.category))) as string[]
    : [];

  const waNumber = config?.whatsappNumber || '60109044199';

  const filtered = products?.filter((p: any) => {
    const mc = !activeCat || p.category === activeCat;
    const ms = (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <>
      <main className="app-shell">
        <header className="header">
          <div className="header-top">
            <button className="icon-btn" onClick={() => window.location.href = '/'}>
              <ArrowLeft size={20} />
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>
                All Products
              </div>
              <div className="brand-sub" style={{ marginTop: 2 }}>{products?.length || 0} ITEMS</div>
            </div>
            <button className="icon-btn" style={{ opacity: 0, pointerEvents: 'none' }}>
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="search-wrap">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => { setActiveCat(''); setSearch(''); }}>
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* CATEGORIES */}
        <div className="categories-section">
          <div className="cat-scroll" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <button
              className={`cat-item ${activeCat === '' ? 'active' : ''}`}
              onClick={() => setActiveCat('')}
            >
              <div className="cat-icon-wrap"><Tag size={18} /></div>
              <span className="cat-label">All</span>
            </button>
            {categories.map((cat) => {
              const Icon = catIcons[cat] || Tag;
              return (
                <button
                  key={cat}
                  className={`cat-item ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  <div className="cat-icon-wrap"><Icon size={18} /></div>
                  <span className="cat-label">{cat.length > 11 ? cat.slice(0, 11) + '...' : cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PRODUCTS */}
        <section id="trending">
          <div className="section-head">
            <h2 className="section-title">{activeCat || 'All Products'}</h2>
            <button className="section-link" onClick={() => { setActiveCat(''); setSearch(''); }}>
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="product-grid">
            {isLoading && <div style={{ gridColumn: '1/-1' }}><div className="spinner" /></div>}

            {filtered && filtered.length > 0 && filtered.map((product: any, i: number) => {
              const Icon = catIcons[product.category] || Monitor;
              const badge = badges[i % badges.length];

              return (
                <article
                  key={product.id}
                  className="pcard"
                  onClick={() => window.location.href = `/products/${product.id}`}
                >
                  <div className="pcard-img">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.name} />
                    ) : (
                      <Icon size={44} className="placeholder-icon" strokeWidth={1.2} />
                    )}
                    <span className="pcard-badge">
                      <TrendingUp size={10} /> {badge.label}
                    </span>
                  </div>
                  <div className="pcard-body">
                    <div className="pcard-cat">{product.category}</div>
                    <h3 className="pcard-name">{product.name}</h3>
                    <div className="pcard-rating">
                      <Star size={12} fill="#F59E0B" strokeWidth={0} />
                      <span>4.8 (500+)</span>
                    </div>
                    <div className="pcard-bottom">
                      <span className="pcard-price">{product.price}</span>
                      <button
                        className="pcard-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          const msg = `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`;
                          window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {filtered && filtered.length === 0 && !isLoading && (
              <div className="empty-box" style={{ gridColumn: '1/-1' }}>
                <Search size={40} />
                <p>Produk tidak ditemukan.</p>
              </div>
            )}
          </div>
        </section>

        <div style={{ height: 16 }} />
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => window.location.href = '/'}>
          <span className="nav-icon"><Home size={22} /></span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-icon"><Grid3X3 size={20} /></span>
          <span className="nav-label">Products</span>
        </button>
        <button className="nav-shop" onClick={() => window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo, saya ingin memesan produk')}`, '_blank')}>
          <ShoppingCart size={22} />
        </button>
        <button className="nav-item" onClick={() => window.location.href = '/#promo'}>
          <span className="nav-icon"><Gift size={20} /></span>
          <span className="nav-label">Deals</span>
        </button>
        <button className="nav-item" onClick={() => window.location.href = '/admin'}>
          <span className="nav-icon"><User size={20} /></span>
          <span className="nav-label">Admin</span>
        </button>
      </nav>
    </>
  );
}