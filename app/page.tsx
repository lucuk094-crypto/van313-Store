'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimer = useRef<any>(null);

  const categories = products
    ? Array.from(new Set(products.map((p: any) => p.category))) as string[]
    : [];

  const categoryIcons: Record<string, string> = {
    'Website Template': '🌐',
    'Landing Page': '📄',
    'Dashboard': '📊',
    'E-Commerce': '🛒',
    'Blog': '✍️',
    'Portfolio': '🎨',
    'SaaS': '☁️',
    'Mobile App': '📱',
  };

  const badgeColors: Record<string, string> = {
    'BESTSELLER': '',
    'NEW': '',
    'TRENDING': 'purple',
    'POPULAR': 'green',
    'HOT': 'purple',
    'SALE': 'green',
  };

  const filtered = products?.filter((p: any) => {
    const matchCategory = !activeCategory || p.category === activeCategory;
    const matchSearch =
      (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2200);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(activeCategory === cat ? '' : cat);
    setTimeout(() => {
      document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const waNumber = config?.whatsappNumber || '60109044199';

  return (
    <>
      <main className="app">
        {/* ======== HEADER ======== */}
        <header className="header">
          <div className="topbar">
            <button className="icon-btn" onClick={() => showToast('☰ Menu')}>
              <i className="ri-menu-line"></i>
            </button>

            <div style={{ textAlign: 'center' }}>
              <div className="logo">
                V<span className="accent">313</span>
              </div>
              <div className="subtitle">PREMIUM DIGITAL PRODUCTS</div>
            </div>

            <button className="icon-btn" onClick={() => showToast('🔔 Notifikasi')}>
              <i className="ri-notification-3-line"></i>
            </button>
          </div>

          <div className="search-row">
            <input
              className="search-input"
              type="search"
              placeholder="Search products, templates, codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="filter-btn"
              onClick={() => {
                setActiveCategory('');
                setSearch('');
              }}
            >
              <i className="ri-filter-3-line"></i>
            </button>
          </div>
        </header>

        {/* ======== HERO ======== */}
        <section className="hero">
          <div className="eyebrow">DIGITAL CODE SHOP</div>
          <h1>
            SOURCE CODE PREMIUM
            <br />
            <span>FOR EVERY NEED.</span>
          </h1>
          <p>
            Kode berkualitas tinggi. Video tutorial lengkap. Siap pakai untuk project Anda.
          </p>
          <button
            className="primary-btn"
            onClick={() => {
              document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            SHOP NOW →
          </button>
          <div className="hero-art" aria-hidden="true">
            💻
            <div className="sub">⌨️</div>
          </div>
        </section>

        {/* ======== CATEGORIES ======== */}
        <section className="categories" id="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="category-icon">
                {categoryIcons[cat] || '📦'}
              </span>
              {cat.length > 12 ? cat.slice(0, 12) + '…' : cat}
            </button>
          ))}

          {/* Default categories if no products yet */}
          {categories.length === 0 && (
            <>
              <button className="category-btn">
                <span className="category-icon">🌐</span>
                Website
              </button>
              <button className="category-btn">
                <span className="category-icon">📄</span>
                Landing Page
              </button>
              <button className="category-btn">
                <span className="category-icon">📊</span>
                Dashboard
              </button>
              <button className="category-btn">
                <span className="category-icon">🛒</span>
                E-Commerce
              </button>
            </>
          )}
        </section>

        {/* ======== TRENDING PRODUCTS ======== */}
        <section className="section" id="trending">
          <div className="section-header">
            <h2>🔥 Trending Products</h2>
            <button
              className="view-all"
              onClick={() => {
                setActiveCategory('');
                setSearch('');
              }}
            >
              View All →
            </button>
          </div>

          <div className="products-grid">
            {isLoading && (
              <div className="empty-state">
                <div className="loading-spinner"></div>
              </div>
            )}

            {filtered && filtered.length > 0
              ? filtered.map((product: any, i: number) => {
                  const badges = ['BESTSELLER', 'TRENDING', 'POPULAR', 'NEW', 'HOT', 'SALE'];
                  const badge = badges[i % badges.length];
                  const badgeClass = badgeColors[badge] || '';

                  return (
                    <article
                      key={product.id}
                      className="product-card"
                      onClick={() => (window.location.href = `/products/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={`product-badge ${badgeClass}`}>{badge}</span>

                      <div className="product-image">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.name} />
                        ) : (
                          <span>{categoryIcons[product.category] || '💻'}</span>
                        )}
                      </div>

                      <h3>{product.name}</h3>

                      <div className="rating">
                        <span className="star">★</span> 4.8 (500+)
                      </div>

                      <div className="price">{product.price}</div>

                      <button
                        className="add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          const msg = `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`;
                          window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        aria-label={`Order ${product.name}`}
                      >
                        <i className="ri-whatsapp-line"></i>
                      </button>
                    </article>
                  );
                })
              : !isLoading && (
                  <div className="empty-state">
                    Produk tidak ditemukan. Coba kata kunci lain.
                  </div>
                )}
          </div>
        </section>

        {/* ======== PROMO ======== */}
        <section className="promo" id="promo-section">
          <div className="eyebrow">LIMITED TIME OFFER</div>
          <h2>
            SOURCE CODE <span>MURAH</span>
          </h2>
          <p>
            Dapatkan source code premium dengan harga terjangkau. Lengkap dengan video tutorial.
          </p>
          <button
            className="primary-btn"
            onClick={() =>
              window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(
                  'Halo, saya ingin info promo terbaru Van313 Store'
                )}`,
                '_blank'
              )
            }
          >
            EXPLORE DEALS →
          </button>
          <div style={{ fontSize: 40, marginTop: 12 }} aria-hidden="true">
            💻 ⌨️
          </div>
        </section>

        {/* Spacer for bottom nav */}
        <div style={{ height: 20 }}></div>
      </main>

      {/* ======== BOTTOM NAV ======== */}
      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-icon">⌂</span>
          Home
        </button>

        <button className="nav-item" onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="nav-icon">▦</span>
          Categories
        </button>

        <button
          className="nav-item shop"
          onClick={() =>
            window.open(
              `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo, saya ingin memesan produk Van313 Store')}`,
              '_blank'
            )
          }
        >
          <span className="nav-icon">♧</span>
          Shop
        </button>

        <button className="nav-item" onClick={() => document.getElementById('promo-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="nav-icon">◇</span>
          Deals
        </button>

        <button className="nav-item" onClick={() => (window.location.href = '/admin')}>
          <span className="nav-icon">♙</span>
          Admin
        </button>
      </nav>

      {/* ======== TOAST ======== */}
      <div className="toast" style={{ display: toast.show ? 'block' : 'none' }}>
        {toast.message}
      </div>
    </>
  );
}