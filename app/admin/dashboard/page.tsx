'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  thumbnail: string;
  demoUrl: string;
  category: string;
  features: string[];
  createdAt: string;
}

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  thumbnail: '',
  demoUrl: '',
  category: 'Website Template',
  features: [] as string[],
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);

  const [tab, setTab] = useState<'products' | 'settings'>('products');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [configForm, setConfigForm] = useState({
    storeName: '',
    tagline: '',
    description: '',
    whatsappNumber: '',
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const isAuth = localStorage.getItem('van313_admin');
    if (!isAuth) router.push('/admin');
  }, [router]);

  useEffect(() => {
    if (config) {
      setConfigForm({
        storeName: config.storeName || '',
        tagline: config.tagline || '',
        description: config.description || '',
        whatsappNumber: config.whatsappNumber || '',
      });
    }
  }, [config]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2200);
  };

  const handleLogout = () => {
    localStorage.removeItem('van313_admin');
    localStorage.removeItem('van313_admin_ts');
    router.push('/admin');
  };

  const openNewForm = () => {
    setEditing(null);
    setForm(emptyProduct);
    setFeatureInput('');
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      demoUrl: product.demoUrl,
      category: product.category,
      features: [...product.features],
    });
    setFeatureInput(product.features.join(', '));
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      const features = featureInput.split(',').map((f) => f.trim()).filter(Boolean);
      const body = { ...form, features, ...(editing ? { id: editing.id } : {}) };

      const res = await fetch('/api/products', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        mutate('/api/products');
        setShowForm(false);
        setEditing(null);
        setForm(emptyProduct);
        setFeatureInput('');
        showToast(editing ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      mutate('/api/products');
      showToast('Produk berhasil dihapus');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });
      mutate('/api/config');
      showToast('Pengaturan berhasil disimpan!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-header">
          <div className="topbar">
            <button className="icon-btn" onClick={() => (window.location.href = '/')}>
              <i className="ri-arrow-left-line"></i>
            </button>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div className="logo" style={{ fontSize: 20 }}>
                Admin <span className="accent">Panel</span>
              </div>
              <div className="subtitle">MANAGE YOUR STORE</div>
            </div>
            <button className="icon-btn" onClick={handleLogout}>
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            className={`admin-tab ${tab === 'products' ? 'active' : ''}`}
            onClick={() => setTab('products')}
          >
            📦 Produk ({products?.length || 0})
          </button>
          <button
            className={`admin-tab ${tab === 'settings' ? 'active' : ''}`}
            onClick={() => setTab('settings')}
          >
            ⚙️ Pengaturan
          </button>
        </div>

        {/* ============ PRODUCTS TAB ============ */}
        {tab === 'products' && (
          <div>
            <button
              className="primary-btn"
              style={{ width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={openNewForm}
            >
              <i className="ri-add-line"></i>
              Tambah Produk Baru
            </button>

            {isLoading && <div className="loading-spinner"></div>}

            {products && products.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.map((product: Product) => (
                  <div key={product.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 12,
                        background: '#f8fafc',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 24,
                        flexShrink: 0,
                        border: '1px solid #e9edf3',
                      }}
                    >
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                        />
                      ) : (
                        '💻'
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#7a8493', marginBottom: 2 }}>
                        <span className="product-badge" style={{ fontSize: 8, padding: '3px 6px' }}>{product.category}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#1264e8' }}>
                        {product.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => openEditForm(product)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: '1px solid #e9edf3',
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          color: '#1264e8',
                        }}
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          color: '#dc2626',
                        }}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#687386' }}>
                  <div style={{ fontSize: 50, marginBottom: 12 }}>📦</div>
                  <p style={{ fontSize: 14, marginBottom: 16 }}>Belum ada produk.</p>
                  <button className="primary-btn" onClick={openNewForm}>
                    Tambah Produk Pertama
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* ============ SETTINGS TAB ============ */}
        {tab === 'settings' && (
          <div className="admin-card">
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>⚙️</span>
              Pengaturan Toko
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#273449', marginBottom: 6, display: 'block' }}>
                  Nama Toko
                </label>
                <input
                  type="text"
                  value={configForm.storeName}
                  onChange={(e) => setConfigForm({ ...configForm, storeName: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#273449', marginBottom: 6, display: 'block' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={configForm.tagline}
                  onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#273449', marginBottom: 6, display: 'block' }}>
                  Deskripsi
                </label>
                <textarea
                  value={configForm.description}
                  onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                  className="admin-textarea"
                  rows={3}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#273449', marginBottom: 6, display: 'block' }}>
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={configForm.whatsappNumber}
                  onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                  placeholder="60109044199"
                  className="admin-input"
                />
                <p style={{ fontSize: 11, color: '#7a8493', marginTop: 4 }}>Format: 628xxxxxxxxxx (tanpa + atau spasi)</p>
              </div>

              <button
                className="primary-btn"
                onClick={handleSaveConfig}
                disabled={saving}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? (
                  <div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }}></div>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 30 }}></div>
      </div>

      {/* ============ PRODUCT FORM MODAL ============ */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(6, 19, 38, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px 16px',
            overflowY: 'auto',
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: 480,
              padding: 24,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                {editing ? '✏️ Edit Produk' : '➕ Tambah Produk'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: '#f1f5f9', border: 0, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>Nama *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Portfolio Template"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>Harga *</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Rp 50.000"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>Kategori</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Website Template"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>Deskripsi *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi lengkap produk..."
                  className="admin-textarea"
                  rows={3}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>
                  Fitur (pisahkan koma)
                </label>
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Responsive, Dark Mode, SEO"
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>URL Thumbnail</label>
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#273449', marginBottom: 4, display: 'block' }}>URL Demo</label>
                  <input
                    type="text"
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: '#e9edf3', margin: '20px 0' }}></div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 25,
                  border: '1px solid #e9edf3',
                  background: 'white',
                  color: '#566174',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving || !form.name || !form.price}
                className="primary-btn"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: saving || !form.name || !form.price ? 0.5 : 1,
                }}
              >
                {saving ? (
                  <div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0 }}></div>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    {editing ? 'Simpan' : 'Tambah'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="toast" style={{ display: toast.show ? 'block' : 'none' }}>
        {toast.message}
      </div>
    </>
  );
}