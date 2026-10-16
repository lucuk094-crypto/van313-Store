'use client';

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductsPage() {
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

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

  const waNumber = config?.whatsappNumber || '60109044199';

  const filtered = products?.filter((p: any) => {
    const matchCategory = !activeCategory || p.category === activeCategory;
    const matchSearch =
      (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <main className="app">
        {/* Header */}
        <header className="header">
          <div className="topbar">
            <button className="icon-btn" onClick={() => (window.location.href = '/')}>
              <i className="ri-arrow-left-line"></i>
            </button>

            <div style={{ textAlign: 'center' }}>
              <div className="logo" style={{ fontSize: 20 }}>
                All <span className="accent">Products</span>
              </div>
              <div className="subtitle">{products?.length || 0} ITEMS</div>
            </div>

            <button className="icon-btn" style={{ opacity: 0, pointerEvents: 'none' }}>
              <i className="ri-menu-line"></i>
            </button>
          </div>

          <div className="search-row">
            <input
              className="search-input"
              type="search"
              placeholder="Search products..."
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

        {/* Categories */}
        <section className="categories">
          <button
            className={`category-btn ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            <span className="category-icon">🔥</span>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="category-icon">
                {categoryIcons[cat] || '📦'}
              </span>
              {cat.length > 12 ? cat.slice(0, 12) + '…' : cat}
            </button>
          ))}
        </section>

        {/* Products */}
        <section className="section" id="trending">
          <div className="section-header">
            <h2>
              {activeCategory || 'All Products'}
            </h2>
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
                  const badges = ['BESTSELLER', 'TRENDING', 'POPULAR', 'NEW'];
                  const badge = badges[i % badges.length];
                  const badgeColors: Record<string, string> = {
                    BESTSELLER: '',
                    TRENDING: 'purple',
                    POPULAR: 'green',
                    NEW: '',
                  };

                  return (
                    <article
                      key={product.id}
                      className="product-card"
                      onClick={() => (window.location.href = `/products/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={`product-badge ${badgeColors[badge] || ''}`}>
                        {badge}
                      </span>

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

        <div style={{ height: 20 }}></div>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => (window.location.href = '/')}>
          <span className="nav-icon">⌂</span>
          Home
        </button>

        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-icon">▦</span>
          Products
        </button>

        <button
          className="nav-item shop"
          onClick={() =>
            window.open(
              `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo, saya ingin memesan produk')}`,
              '_blank'
            )
          }
        >
          <span className="nav-icon">♧</span>
          Shop
        </button>

        <button className="nav-item" onClick={() => (window.location.href = '/#promo')}>
          <span className="nav-icon">◇</span>
          Deals
        </button>

        <button className="nav-item" onClick={() => (window.location.href = '/admin')}>
          <span className="nav-icon">♙</span>
          Admin
        </button>
      </nav>
    </>
  );
}