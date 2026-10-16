'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Save, X, LogOut,
  Package, Settings, Eye, Tag, Link as LinkIcon,
  MessageCircle, FileText, Layers, Grip
} from 'lucide-react';
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

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  description: '',
  price: '',
  thumbnail: '',
  demoUrl: '',
  category: 'Website Template',
  features: [],
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

  const addFeature = () => {
    if (featureInput.trim()) {
      const newFeatures = featureInput.split(',').map((f) => f.trim()).filter(Boolean);
      setForm({ ...form, features: newFeatures });
    }
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      const features = featureInput
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const body = {
        ...form,
        features,
        ...(editing ? { id: editing.id } : {}),
      };

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      mutate('/api/products');
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
      alert('Konfigurasi berhasil disimpan!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-vanilla/40 text-sm mt-1">Kelola produk dan pengaturan toko Anda.</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-glass px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('products')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              tab === 'products'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'glass text-vanilla/50 hover:text-vanilla'
            }`}
          >
            <Package size={15} />
            Produk ({products?.length || 0})
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              tab === 'settings'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'glass text-vanilla/50 hover:text-vanilla'
            }`}
          >
            <Settings size={15} />
            Pengaturan
          </button>
        </div>

        {/* ============ PRODUCTS TAB ============ */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Daftar Produk</h2>
              <button
                onClick={openNewForm}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                <Plus size={15} />
                Tambah Produk
              </button>
            </div>

            {isLoading && (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
              </div>
            )}

            <div className="grid gap-4">
              {products?.map((product: Product) => (
                <motion.div
                  key={product.id}
                  layout
                  className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Tag size={20} className="text-accent" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-vanilla truncate">{product.name}</h3>
                      <span className="badge text-xs flex-shrink-0">{product.category}</span>
                    </div>
                    <p className="text-vanilla/40 text-sm truncate">{product.description}</p>
                    <span className="text-accent font-bold text-sm mt-1 inline-block">{product.price}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditForm(product)}
                      className="p-2.5 rounded-xl glass hover:bg-accent/10 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} className="text-accent" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 rounded-xl glass hover:bg-red-400/10 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {products && products.length === 0 && (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto text-vanilla/15 mb-4" />
                <p className="text-vanilla/30 mb-4">Belum ada produk.</p>
                <button onClick={openNewForm} className="btn-primary px-5 py-2.5 rounded-xl text-sm">
                  Tambah Produk Pertama
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============ SETTINGS TAB ============ */}
        {tab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 max-w-2xl"
          >
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Settings size={18} className="text-accent" />
              Pengaturan Toko
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-vanilla/50 mb-2 block">Nama Toko</label>
                <input
                  type="text"
                  value={configForm.storeName}
                  onChange={(e) => setConfigForm({ ...configForm, storeName: e.target.value })}
                  className="input-glass py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm text-vanilla/50 mb-2 block">Tagline</label>
                <input
                  type="text"
                  value={configForm.tagline}
                  onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                  className="input-glass py-3 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm text-vanilla/50 mb-2 block">Deskripsi Toko</label>
                <textarea
                  value={configForm.description}
                  onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                  className="input-glass py-3 rounded-xl"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-vanilla/50 mb-2 block">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={configForm.whatsappNumber}
                  onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                  placeholder="628xxxxxxxxxx"
                  className="input-glass py-3 rounded-xl"
                />
                <p className="text-vanilla/25 text-xs mt-1">Format: 628xxxxxxxxxx (tanpa + atau spasi)</p>
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Simpan Pengaturan
              </button>
            </div>
          </motion.div>
        )}

        {/* ============ PRODUCT FORM MODAL ============ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20 overflow-y-auto"
              onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="glass-strong rounded-3xl p-6 md:p-8 w-full max-w-2xl mb-10 glow-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {editing ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X size={20} className="text-vanilla/50" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-vanilla/50 mb-2 block">Nama Produk *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Portfolio Template"
                        className="input-glass py-3 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-vanilla/50 mb-2 block">Harga *</label>
                      <input
                        type="text"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="e.g. Rp 50.000"
                        className="input-glass py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-vanilla/50 mb-2 block">Kategori</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Website Template"
                      className="input-glass py-3 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-vanilla/50 mb-2 block">Deskripsi *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Deskripsi lengkap produk..."
                      className="input-glass py-3 rounded-xl"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-vanilla/50 mb-2 block">
                      Fitur (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onBlur={addFeature}
                      placeholder="e.g. Responsive, Dark Mode, SEO Ready"
                      className="input-glass py-3 rounded-xl"
                    />
                    {form.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.features.map((f, i) => (
                          <span key={i} className="badge text-xs">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-vanilla/50 mb-2 block">
                        URL Thumbnail (opsional)
                      </label>
                      <input
                        type="text"
                        value={form.thumbnail}
                        onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="input-glass py-3 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-vanilla/50 mb-2 block">
                        URL Demo (opsional)
                      </label>
                      <input
                        type="text"
                        value={form.demoUrl}
                        onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                        placeholder="https://..."
                        className="input-glass py-3 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="accent-line my-6" />

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowForm(false)}
                    className="btn-glass px-5 py-2.5 rounded-xl text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving || !form.name || !form.price}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-40"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    {editing ? 'Simpan Perubahan' : 'Tambah Produk'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}