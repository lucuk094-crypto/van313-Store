'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import {
  ArrowLeft, Star, CheckCircle, ExternalLink,
  MessageCircle, Download, Play, Shield, Package,
  Monitor, Layout, BarChart3, ShoppingBag,
  FileCode, Palette, Cloud, Smartphone,
  Tag,
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

export default function ProductDetailPage() {
  const params = useParams();
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);

  const product = products?.find((p: any) => p.id === params.id);
  const waNumber = config?.whatsappNumber || '60109044199';

  if (isLoading) {
    return (
      <div className="detail-shell">
        <div className="detail-header">
          <button className="icon-btn" onClick={() => window.location.href = '/products'}>
            <ArrowLeft size={20} />
          </button>
          <span className="detail-header-title">Loading...</span>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-shell">
        <div className="detail-header">
          <button className="icon-btn" onClick={() => window.location.href = '/products'}>
            <ArrowLeft size={20} />
          </button>
          <span className="detail-header-title">Not Found</span>
          <div style={{ width: 40 }} />
        </div>
        <div className="empty-box" style={{ paddingTop: 80 }}>
          <Package size={48} />
          <p>Produk tidak ditemukan.</p>
          <button className="btn-navy" onClick={() => window.location.href = '/products'}>
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  const Icon = catIcons[product.category] || Monitor;
  const waMsg = `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`;

  return (
    <div className="detail-shell">
      {/* HEADER */}
      <div className="detail-header">
        <button className="icon-btn" onClick={() => window.location.href = '/products'}>
          <ArrowLeft size={20} />
        </button>
        <span className="detail-header-title">Detail Produk</span>
        <div style={{ width: 40 }} />
      </div>

      {/* IMAGE */}
      <div className="detail-img">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.name} />
        ) : (
          <Icon size={64} strokeWidth={1} style={{ color: '#D4CCC0' }} />
        )}
      </div>

      {/* CONTENT */}
      <div className="detail-content">
        <div className="detail-cat">
          <Tag size={10} /> {product.category}
        </div>
        <h1 className="detail-title">{product.name}</h1>
        <div className="detail-price">{product.price}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#5A6178' }}>
          <Star size={14} fill="#F59E0B" strokeWidth={0} />
          <span style={{ fontWeight: 600 }}>4.8</span>
          <span>(500+ reviews)</span>
        </div>

        <div className="detail-divider" />

        {/* DESCRIPTION */}
        <h3 className="detail-section-title">Deskripsi Produk</h3>
        <p className="detail-desc">{product.description}</p>

        {/* FEATURES */}
        {product.features && product.features.length > 0 && (
          <>
            <div className="detail-divider" />
            <h3 className="detail-section-title">Fitur Produk</h3>
            <div>
              {product.features.map((f: string, i: number) => (
                <div key={i} className="feature-row">
                  <CheckCircle size={16} />
                  <span>{f}</span>
                </div>
              ))}
              <div className="feature-row">
                <Download size={16} />
                <span>Source Code Lengkap via Google Drive</span>
              </div>
              <div className="feature-row">
                <Play size={16} />
                <span>Video Tutorial Pemasangan</span>
              </div>
              <div className="feature-row">
                <Shield size={16} />
                <span>Garansi & Dukungan Teknis</span>
              </div>
            </div>
          </>
        )}

        <div style={{ height: 100 }} />
      </div>

      {/* BOTTOM BAR */}
      <div className="detail-bottom">
        {product.demoUrl && (
          <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ minWidth: 0 }}>
            <ExternalLink size={15} /> Demo
          </a>
        )}
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <MessageCircle size={16} /> Order via WhatsApp
        </a>
      </div>
    </div>
  );
}