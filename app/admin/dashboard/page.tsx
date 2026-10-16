'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import {
  ArrowLeft, LogOut, Plus, Pencil, Trash2, Save, X,
  Package, Settings, Tag, Bell, Store,
  Monitor, Layout, BarChart3, ShoppingBag,
  FileCode, Palette, Cloud, Smartphone,
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

const emptyForm = { name: '', description: '', price: '', thumbnail: '', demoUrl: '', category: 'Website Template', features: [] as string[] };

export default function AdminDashboard() {
  const router = useRouter();
  const { data: products, isLoading } = useSWR('/api/products', fetcher);
  const { data: config } = useSWR('/api/config', fetcher);

  const [tab, setTab] = useState<'products' | 'settings'>('products');
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [cfg, setCfg] = useState({ storeName: '', tagline: '', description: '', whatsappNumber: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('van313_admin')) router.push('/admin');
  }, [router]);

  useEffect(() => {
    if (config) setCfg({ storeName: config.storeName || '', tagline: config.tagline || '', description: config.description || '', whatsappNumber: config.whatsappNumber || '' });
  }, [config]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2200); };
  const logout = () => { localStorage.removeItem('van313_admin'); router.push('/admin'); };

  const openNew = () => { setEditing(null); setForm(emptyForm); setFeatureInput(''); setShowForm(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, thumbnail: p.thumbnail, demoUrl: p.demoUrl, category: p.category, features: [...p.features] }); setFeatureInput(p.features.join(', ')); setShowForm(true); };

  const saveProduct = async () => {
    setSaving(true);
    try {
      const features = featureInput.split(',').map(f => f.trim()).filter(Boolean);
      const body = { ...form, features, ...(editing ? { id: editing.id } : {}) };
      await fetch('/api/products', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      mutate('/api/products');
      setShowForm(false); setEditing(null); setForm(emptyForm); setFeatureInput('');
      showToast(editing ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
    } catch { showToast('Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    mutate('/api/products'); showToast('Produk dihapus');
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
      mutate('/api/config'); showToast('Pengaturan disimpan');
    } catch { showToast('Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="admin-shell">
        <div className="admin-header">
          <div className="header-top">
            <button className="icon-btn" onClick={() => window.location.href = '/'}>
              <ArrowLeft size={20} />
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="brand-name" style={{ fontSize: 18 }}>
                Admin <span className="accent">Panel</span>
              </div>
              <div className="brand-sub">MANAGE YOUR STORE</div>
            </div>
            <button className="icon-btn" onClick={logout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8 }}>
          <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            <Package size={14} /> Produk ({products?.length || 0})
          </button>
          <button className={`admin-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
            <Settings size={14} /> Pengaturan
          </button>
        </div>

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div style={{ padding: 16 }}>
            <button className="btn-gold" style={{ width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={openNew}>
              <Plus size={15} /> Tambah Produk
            </button>

            {isLoading && <div className="spinner" />}

            {products && products.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.map((p: any) => {
                  const Icon = catIcons[p.category] || Monitor;
                  return (
                    <div key={p.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F8F4EE', border: '1px solid #E8E0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {p.thumbnail ? <img src={p.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : <Icon size={20} style={{ color: '#D4CCC0' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: 'rgba(200,149,76,0.08)', color: '#C8954C', border: '1px solid rgba(200,149,76,0.15)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{p.category}</span>
                          <span style={{ fontSize: 14, fontWeight: 900, color: '#0A0F1E', letterSpacing: '-0.5px' }}>{p.price}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #E8E0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8954C', transition: 'all 0.2s' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', transition: 'all 0.2s' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {products && products.length === 0 && !isLoading && (
              <div className="empty-box">
                <Package size={44} />
                <p>Belum ada produk.</p>
                <button className="btn-gold" onClick={openNew}><Plus size={14} /> Tambah Produk</button>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div style={{ padding: 16 }}>
            <div className="admin-card">
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} style={{ color: '#C8954C' }} /> Pengaturan Toko
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>Nama Toko</label>
                  <input type="text" value={cfg.storeName} onChange={e => setCfg({ ...cfg, storeName: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>Tagline</label>
                  <input type="text" value={cfg.tagline} onChange={e => setCfg({ ...cfg, tagline: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>Deskripsi</label>
                  <textarea value={cfg.description} onChange={e => setCfg({ ...cfg, description: e.target.value })} className="admin-textarea" rows={3} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block' }}>Nomor WhatsApp</label>
                  <input type="text" value={cfg.whatsappNumber} onChange={e => setCfg({ ...cfg, whatsappNumber: e.target.value })} placeholder="628xxxxxxxxxx" className="admin-input" />
                  <p style={{ fontSize: 11, color: '#5A6178', marginTop: 4 }}>Format: 628xxxxxxxxxx (tanpa + atau spasi)</p>
                </div>
                <button className="btn-gold" onClick={saveConfig} disabled={saving} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: saving ? 0.6 : 1 }}>
                  {saving ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: 0, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <><Save size={14} /> Simpan</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10, 15, 30, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="admin-card" style={{ width: '100%', maxWidth: 440, padding: 24, marginTop: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                {editing ? <><Pencil size={16} /> Edit Produk</> : <><Plus size={16} /> Tambah Produk</>}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #E8E0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6178' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>Nama *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Portfolio Template" className="admin-input" />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>Harga *</label>
                  <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Rp 50.000" className="admin-input" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>Kategori</label>
                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Website Template" className="admin-input" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>Deskripsi *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi lengkap..." className="admin-textarea" rows={3} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>Fitur (pisahkan koma)</label>
                <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Responsive, Dark Mode, SEO" className="admin-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>URL Thumbnail</label>
                  <input type="text" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." className="admin-input" />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'block' }}>URL Demo</label>
                  <input type="text" value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://..." className="admin-input" />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: '#E8E0D4', margin: '20px 0' }} />

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
              <button onClick={saveProduct} disabled={saving || !form.name || !form.price} className="btn-gold" style={{ flex: 1, justifyContent: 'center', opacity: saving || !form.name || !form.price ? 0.5 : 1 }}>
                {saving ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: 0, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <><Save size={14} /> {editing ? 'Simpan' : 'Tambah'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast-bar ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}