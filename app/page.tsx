'use client';

import { useState, useRef } from 'react';
import useSWR from 'swr';
import {
  Search, SlidersHorizontal, Bell, ShoppingCart,
  ArrowRight, ChevronRight, Star, Plus,
  Monitor, Layout, BarChart3, ShoppingBag,
  FileCode, Palette, Cloud, Smartphone,
  Zap, TrendingUp, Flame, Tag,
  MessageCircle, Home, Grid3X3, Store, Gift, User,
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
  { label: 'BESTSELLER', color: '' },
  { label: 'TRENDING', color: 'purple' },
  { label: 'POPULAR', color: 'green' },
  { label: 'NEW', color: '' },
];

export default function HomePage() {
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [toast, setToast] = useState('');
  const timer = useRef<any>(null);

  const categories = products
    ? Array.from(new Set(products.map((p: any) => p.category))) as string[]
    : [];

  const waNumber = config?.whatsappNumber || '60109044199';

  const filtered = products?.filter((p: any) => {
    const mc = !activeCat || p.category === activeCat;
    const ms = (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2200);
  };

  const handleCat = (cat: string) => {
    setActiveCat(activeCat === cat ? '' : cat);
    setTimeout(() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <>
      <main className="app-shell">
        {/* HEADER */}
        <header className="header">
          <div className="header-top">
            <div className="brand">
              <div className="brand-icon">
                <Store size={18} color="white" />
              </div>
              <div>
                <div className="brand-name">
                  Van<span className="accent">313</span>
                </div>
                <div className="brand-sub">Premium Digital Store</div>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn" onClick={() => showToast('Notifikasi')}>
                <Bell size={20} />
                <span className="badge-dot" />
              </button>
            </div>
          </div>

          <div className="search-wrap">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products, templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => { setActiveCat(''); setSearch(''); }}>
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">
            <Zap size={12} /> DIGITAL CODE SHOP
          </div>
          <h1>
            SOURCE CODE
            <br />
            <span className="highlight">FOR EVERY NEED.</span>
          </h1>
          <p className="hero-desc">
            Kode berkualitas tinggi dengan video tutorial lengkap. Siap pakai untuk project Anda.
          </p>
          <button className="btn-gold" onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}>
            SHOP NOW <ArrowRight size={14} />
          </button>
          <div className="hero-visual">
            <Monitor size={100} strokeWidth={1} />
          </div>
        </section>

        {/* CATEGORIES */}
        <div className="categories-section">
          <div className="cat-scroll">
            {categories.map((cat) => {
              const Icon = catIcons[cat] || Tag;
              return (
                <button
                  key={cat}
                  className={`cat-item ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => handleCat(cat)}
                >
                  <div className="cat-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <span className="cat-label">
                    {cat.length > 11 ? cat.slice(0, 11) + '...' : cat}
                  </span>
                </button>
              );
            })}
            {categories.length === 0 && (
              <>
                {[
                  { icon: Monitor, label: 'Website' },
                  { icon: Layout, label: 'Landing' },
                  { icon: BarChart3, label: 'Dashboard' },
                  { icon: ShoppingBag, label: 'E-Commerce' },
                ].map((c) => (
                  <button key={c.label} className="cat-item">
                    <div className="cat-icon-wrap"><c.icon size={20} /></div>
                    <span className="cat-label">{c.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* TRENDING */}
        <section id="trending">
          <div className="section-head">
            <h2 className="section-title">Trending Products</h2>
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

        {/* PROMO */}
        <section className="promo-banner">
          <div className="hero-eyebrow">
            <Flame size={12} /> LIMITED TIME OFFER
          </div>
          <h2>
            SOURCE CODE
            <br />
            <span className="highlight">MURAH BERKUALITAS</span>
          </h2>
          <p className="promo-desc">
            Dapatkan source code premium dengan harga terjangkau. Lengkap dengan video tutorial.
          </p>
          <button
            className="btn-gold"
            onClick={() => window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo, saya ingin info promo terbaru Van313 Store')}`, '_blank')}
          >
            EXPLORE DEALS <ArrowRight size={14} />
          </button>
        </section>

        <div style={{ height: 16 }} />
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-icon"><Home size={22} /></span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-item" onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="nav-icon"><Grid3X3 size={20} /></span>
          <span className="nav-label">Products</span>
        </button>
        <button className="nav-shop" onClick={() => window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo, saya ingin memesan produk Van313 Store')}`, '_blank')}>
          <ShoppingCart size={22} />
        </button>
        <button className="nav-item" onClick={() => document.querySelector('.promo-banner')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="nav-icon"><Gift size={20} /></span>
          <span className="nav-label">Deals</span>
        </button>
        <button className="nav-item" onClick={() => window.location.href = '/admin'}>
          <span className="nav-icon"><User size={20} /></span>
          <span className="nav-label">Admin</span>
        </button>
      </nav>

      {/* TOAST */}
      <div className={`toast-bar ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}