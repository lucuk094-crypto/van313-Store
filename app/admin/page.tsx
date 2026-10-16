'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Shield, ArrowLeft, Store } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('van313_admin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Password salah!');
      }
    } catch {
      setError('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="header-top">
          <button className="icon-btn" onClick={() => window.location.href = '/'}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Admin Panel</div>
          </div>
          <div style={{ width: 40 }} />
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <div className="admin-card" style={{ width: '100%', maxWidth: 380, padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #C8954C, #A07836)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 16px rgba(200, 149, 76, 0.3)',
            }}>
              <Shield size={26} color="white" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.3px' }}>
              Selamat Datang
            </h2>
            <p style={{ fontSize: 13, color: '#5A6178' }}>
              Masukkan password untuk mengakses dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 6, display: 'block', letterSpacing: '-0.2px' }}>
                Password Admin
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#B0A898' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="admin-input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    color: '#B0A898', display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
                padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#DC2626',
                textAlign: 'center', fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{
                width: '100%', padding: '14px', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, margin: 0, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <><Lock size={15} /> Masuk</>}
            </button>
          </form>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: '#C8954C', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <ArrowLeft size={14} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}