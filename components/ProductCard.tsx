'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MessageCircle, Tag, Eye } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  thumbnail: string;
  demoUrl: string;
  category: string;
  features: string[];
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const waLink = `https://wa.me/60109044199?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk "${product.name}" dengan harga ${product.price}. Apakah masih tersedia?`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 via-dark-light to-accent/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-3">
                <Tag size={28} className="text-accent" />
              </div>
              <span className="text-vanilla/30 text-sm font-medium">{product.category}</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge text-xs">{product.category}</span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 rounded-xl bg-dark/80 backdrop-blur-sm text-accent font-bold text-sm border border-accent/20">
            {product.price}
          </span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/10 hover:bg-accent/20 transition-colors"
              title="View Demo"
            >
              <Eye size={20} className="text-vanilla" />
            </a>
          )}
          <Link
            href={`/products/${product.id}`}
            className="p-3 rounded-xl bg-white/10 hover:bg-accent/20 transition-colors"
            title="View Details"
          >
            <ExternalLink size={20} className="text-vanilla" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-vanilla mb-2 group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-vanilla/40 text-sm leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Features Preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.features.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-vanilla/50 border border-white/5"
            >
              {feature}
            </span>
          ))}
          {product.features.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-vanilla/30">
              +{product.features.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 btn-glass text-center text-sm py-2.5 rounded-xl"
          >
            Detail
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5"
          >
            <MessageCircle size={15} />
            Order
          </a>
        </div>
      </div>
    </motion.div>
  );
}