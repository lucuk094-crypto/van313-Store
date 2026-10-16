'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem('van313_admin_ts', Date.now().toString());
        router.push('/admin/dashboard');
      } else {
        setError('Password salah!');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div className="admin-header" style={{ textAlign: 'center', borderRadius: '0 0 23px 23px' }}>
        <div style={{ fontSize: 50, marginBottom: 8 }}>🔐</div>
        <div className="logo" style={{ fontSize: 28 }}>
          V<span className="accent">313</span>
        </div>
        <div className="subtitle" style={{ marginTop: 6 }}>ADMIN DASHBOARD</div>
      </div>

      {/* Login Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
        <div className="admin-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>
            Selamat Datang 👋
          </h2>
          <p style={{ fontSize: 13, color: '#566174', textAlign: 'center', marginBottom: 24 }}>
            Masukkan password untuk mengakses dashboard
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#273449', marginBottom: 8, display: 'block' }}>
                Password Admin
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="admin-input"
                  style={{ paddingRight: 48 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#7a8493',
                    fontSize: 18,
                  }}
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: '#dc2626',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="primary-btn"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? (
                <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }}></div>
              ) : (
                <>
                  <i className="ri-lock-line"></i>
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back */}
      <div style={{ textAlign: 'center', paddingBottom: 20 }}>
        <button
          onClick={() => (window.location.href = '/')}
          style={{ background: 'none', border: 'none', color: '#1555a9', fontSize: 13, fontWeight: 600 }}
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}