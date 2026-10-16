import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Van313 Store — Premium Digital Products',
  description: 'Source code website premium berkualitas tinggi dengan video tutorial pemasangan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}