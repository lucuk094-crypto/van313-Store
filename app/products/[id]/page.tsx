'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  ExternalLink,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Download,
  Play,
  Shield,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import ScrollReveal from '@/components/ScrollReveal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductDetailPage() {
  const params = useParams();
  const { data: products, isLoading } = useSWR('/api/products', fetcher);

  const product = products?.find((p: any) => p.id === params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Package size={48} className="text-vanilla/20 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-vanilla/40 mb-6">Produk yang Anda cari tidak tersedia.</p>
        <Link href="/products" className="btn-primary px-6 py-3 rounded-xl">
          Kembali ke Produk
        </Link>
      </div>
    );
  }

  const waLink = `https://wa.me/60109044199?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`
  )}`;

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 pt-4"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-vanilla/50 hover:text-accent transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Produk
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl overflow-hidden">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-accent/20 via-dark-light to-accent/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-accent/10 flex items-center justify-center mb-4">
                      <Tag size={36} className="text-accent" />
                    </div>
                    <span className="text-vanilla/30 text-lg font-medium">{product.category}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <ScrollReveal delay={0.2}>
              <div className="glass-card rounded-2xl p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full" />
                  Deskripsi Produk
                </h3>
                <p className="text-vanilla/50 leading-relaxed">{product.description}</p>
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal delay={0.3}>
              <div className="glass-card rounded-2xl p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full" />
                  Fitur Produk
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                    >
                      <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                      <span className="text-vanilla/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </motion.div>

          {/* Right: Info & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-strong rounded-2xl p-6 sticky top-24">
              <span className="badge mb-4">{product.category}</span>
              <h1 className="text-2xl font-bold text-vanilla mb-3">{product.name}</h1>

              <div className="text-3xl font-bold text-accent mb-6 glow-text">
                {product.price}
              </div>

              <div className="accent-line mb-6" />

              {/* What You Get */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-vanilla/60 uppercase tracking-wider mb-3">
                  Yang Anda Dapatkan
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-vanilla/60">
                    <Download size={16} className="text-accent flex-shrink-0" />
                    Source Code Lengkap via Google Drive
                  </div>
                  <div className="flex items-center gap-3 text-sm text-vanilla/60">
                    <Play size={16} className="text-accent flex-shrink-0" />
                    Video Tutorial Pemasangan
                  </div>
                  <div className="flex items-center gap-3 text-sm text-vanilla/60">
                    <Shield size={16} className="text-accent flex-shrink-0" />
                    Garansi & Dukungan Teknis
                  </div>
                </div>
              </div>

              <div className="accent-line mb-6" />

              {/* Actions */}
              <div className="space-y-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base glow-accent"
                >
                  <MessageCircle size={18} />
                  Pesan via WhatsApp
                </a>

                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink size={16} />
                    Lihat Demo
                  </a>
                )}
              </div>

              <p className="text-vanilla/25 text-xs text-center mt-4">
                Source code & video dikirim via Google Drive setelah konfirmasi pembayaran.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}