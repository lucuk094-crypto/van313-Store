'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code2, Video, Shield, Zap, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const features = [
  {
    icon: Code2,
    title: 'Source Code Lengkap',
    desc: 'Dapatkan source code bersih, terstruktur, dan siap pakai untuk project Anda.',
  },
  {
    icon: Video,
    title: 'Video Tutorial',
    desc: 'Video panduan pemasangan langkah demi langkah agar Anda tidak bingung.',
  },
  {
    icon: Shield,
    title: 'Garansi Produk',
    desc: 'Setiap produk dilengkapi garansi dan dukungan teknis dari kami.',
  },
  {
    icon: Zap,
    title: 'Langsung Dikirim',
    desc: 'Pesanan Anda langsung dikirim via Google Drive setelah konfirmasi.',
  },
];

export default function HomePage() {
  const { data: products } = useSWR('/api/products', fetcher);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        {/* Decorative Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-[80px] animate-float-delayed" />

        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="badge mb-6 inline-block text-xs tracking-widest">
              🚀 PREMIUM DIGITAL PRODUCTS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Van313</span>
            <br />
            <span className="text-vanilla/90">Store</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-vanilla/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Source code website premium lengkap dengan video tutorial pemasangan.
            Tingkatkan project Anda dengan kode berkualitas tinggi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 text-base glow-accent"
            >
              <ShoppingBag size={18} />
              Lihat Produk
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/60109044199"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass px-8 py-4 rounded-2xl flex items-center gap-2 text-base"
            >
              <MessageCircle size={18} />
              Chat Kami
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-vanilla/20 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-accent"
            />
          </div>
        </motion.div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Kenapa Pilih <span className="text-accent">Kami</span>?
              </h2>
              <p className="text-vanilla/40 max-w-lg mx-auto">
                Kami menyediakan produk digital berkualitas tinggi dengan layanan terbaik.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 text-center h-full">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                    <feat.icon size={26} className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-vanilla mb-2">{feat.title}</h3>
                  <p className="text-vanilla/40 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Produk <span className="text-accent">Terbaru</span>
                </h2>
                <p className="text-vanilla/40">Source code website premium pilihan kami.</p>
              </div>
              <Link
                href="/products"
                className="btn-glass px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                Lihat Semua
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.slice(0, 4).map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {(!products || products.length === 0) && (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-vanilla/20 mb-4" />
              <p className="text-vanilla/30">Produk akan segera tersedia.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto glass-strong rounded-3xl p-10 md:p-14 text-center glow-border">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Meningkatkan <span className="text-accent">Project</span> Anda?
            </h2>
            <p className="text-vanilla/40 mb-8 max-w-lg mx-auto">
              Hubungi kami via WhatsApp untuk pemesanan cepat dan konsultasi gratis.
            </p>
            <a
              href="https://wa.me/60109044199?text=Halo, saya tertarik dengan produk di Van313 Store"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 rounded-2xl inline-flex items-center gap-2 text-base glow-accent"
            >
              <MessageCircle size={18} />
              Chat via WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}