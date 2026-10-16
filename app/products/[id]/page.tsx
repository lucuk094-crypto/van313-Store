'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductDetailPage() {
  const params = useParams();
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);

  const product = products?.find((p: any) => p.id === params.id);
  const waNumber = config?.whatsappNumber || '60109044199';

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

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <button className="back-btn" onClick={() => (window.location.href = '/products')}>
            <i className="ri-arrow-left-line"></i>
          </button>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Loading...</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <button className="back-btn" onClick={() => (window.location.href = '/products')}>
            <i className="ri-arrow-left-line"></i>
          </button>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Not Found</span>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 60, color: '#687386' }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>😕</div>
          <p>Produk tidak ditemukan.</p>
          <button
            className="primary-btn"
            style={{ marginTop: 20 }}
            onClick={() => (window.location.href = '/products')}
          >
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  const waMsg = `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`;
  const demoMsg = `Halo, saya ingin melihat demo produk "${product.name}"`;

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => (window.location.href = '/products')}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, flex: 1, textAlign: 'center', marginRight: 30 }}>
          Detail Produk
        </span>
      </div>

      {/* Image */}
      <div className="detail-image">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.name} />
        ) : (
          <span>{categoryIcons[product.category] || '💻'}</span>
        )}
      </div>

      {/* Body */}
      <div className="detail-body">
        <span
          className="product-badge"
          style={{ marginBottom: 12, display: 'inline-block' }}
        >
          {product.category}
        </span>

        <h1 className="detail-title">{product.name}</h1>
        <div className="detail-price">{product.price}</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <span style={{ color: '#7a8493', fontSize: 13 }}>
            <span style={{ color: '#f4b323' }}>★</span> 4.8 (500+ reviews)
          </span>
        </div>

        {/* Description */}
        <h3 className="detail-section-title">Deskripsi Produk</h3>
        <p className="detail-desc">{product.description}</p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <>
            <h3 className="detail-section-title">Yang Anda Dapatkan</h3>
            <ul className="feature-list">
              {product.features.map((f: string, i: number) => (
                <li key={i}>
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
              <li>
                <span className="feature-check">✓</span>
                Source Code Lengkap via Google Drive
              </li>
              <li>
                <span className="feature-check">✓</span>
                Video Tutorial Pemasangan
              </li>
              <li>
                <span className="feature-check">✓</span>
                Garansi & Dukungan Teknis
              </li>
            </ul>
          </>
        )}

        {/* Spacer for bottom bar */}
        <div style={{ height: 80 }}></div>
      </div>

      {/* Order Bar */}
      <div className="order-bar">
        {product.demoUrl && (
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="order-btn secondary"
            style={{ textDecoration: 'none', maxWidth: 120 }}
          >
            <i className="ri-eye-line"></i>
            Demo
          </a>
        )}
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="order-btn primary"
          style={{ textDecoration: 'none' }}
        >
          <i className="ri-whatsapp-line"></i>
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}