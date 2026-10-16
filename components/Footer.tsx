import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="accent-line mb-12" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <span className="text-dark font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold">
                <span className="text-vanilla">Van</span>
                <span className="text-accent">313</span>
              </span>
            </div>
            <p className="text-vanilla/40 text-sm leading-relaxed">
              Penyedia source code website premium berkualitas tinggi dengan video tutorial pemasangan lengkap.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-vanilla/60 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-vanilla/40 hover:text-accent transition-colors text-sm">
                Home
              </Link>
              <Link href="/products" className="text-vanilla/40 hover:text-accent transition-colors text-sm">
                Products
              </Link>
              <Link href="/admin" className="text-vanilla/40 hover:text-accent transition-colors text-sm">
                Admin
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-vanilla/60 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <p className="text-vanilla/40 text-sm">
              Hubungi kami via WhatsApp untuk pemesanan dan pertanyaan.
            </p>
            <a
              href="https://wa.me/60109044199"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-accent hover:text-accent-light transition-colors text-sm font-medium"
            >
              Chat WhatsApp →
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-vanilla/25 text-xs">
            © 2026 Van313 Store. All rights reserved.
          </p>
          <p className="text-vanilla/25 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-accent" /> by Van313
          </p>
        </div>
      </div>
    </footer>
  );
}