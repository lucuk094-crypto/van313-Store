'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => router.push('/')}
      >
        <span className="nav-icon">⌂</span>
        Home
      </button>

      <button
        className={`nav-item ${isActive('/products') ? 'active' : ''}`}
        onClick={() => router.push('/products')}
      >
        <span className="nav-icon">▦</span>
        Products
      </button>

      <button
        className="nav-item shop"
        onClick={() => {
          window.open(
            'https://wa.me/60109044199?text=' +
              encodeURIComponent('Halo, saya ingin bertanya tentang produk Van313 Store'),
            '_blank'
          );
        }}
      >
        <span className="nav-icon">♧</span>
        Shop
      </button>

      <button
        className={`nav-item ${isActive('/products') ? 'active' : ''}`}
        onClick={() => {
          const el = document.getElementById('promo-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            router.push('/#promo');
          }
        }}
      >
        <span className="nav-icon">◇</span>
        Deals
      </button>

      <button
        className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
        onClick={() => router.push('/admin')}
      >
        <span className="nav-icon">♙</span>
        Admin
      </button>
    </nav>
  );
}