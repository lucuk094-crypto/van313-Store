'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Shield } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: null },
    { href: '/products', label: 'Products', icon: ShoppingBag },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong py-3 shadow-lg shadow-black/20'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center glow-accent group-hover:scale-105 transition-transform">
              <span className="text-dark font-bold text-lg">V</span>
            </div>
            <div>
              <span className="text-xl font-bold text-vanilla">Van</span>
              <span className="text-xl font-bold text-accent">313</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-vanilla/70 hover:text-vanilla hover:bg-white/5 transition-all duration-300 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="ml-3 px-5 py-2.5 rounded-xl glass flex items-center gap-2 text-sm font-medium text-accent hover:bg-accent/10 transition-all duration-300"
            >
              <Shield size={15} />
              Admin
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-4 right-4 z-50 glass-strong rounded-2xl p-5 flex flex-col gap-2 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="accent-line my-2" />
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl hover:bg-accent/10 transition-colors text-sm font-medium text-accent flex items-center gap-2"
            >
              <Shield size={15} />
              Admin Dashboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}