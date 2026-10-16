import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticlesBg from '@/components/ParticlesBg';

export const metadata: Metadata = {
  title: 'Van313 Store | Premium Digital Products',
  description: 'Penyedia source code website premium berkualitas tinggi dengan video tutorial pemasangan lengkap.',
  keywords: ['source code', 'website template', 'digital products', 'van313'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <div className="mesh-bg" />
        <ParticlesBg />
        <Navbar />
        <main className="relative z-10 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}