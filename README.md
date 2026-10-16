# 🛒 Van313 Store

Premium Digital Products Store - Jual source code website dengan video tutorial pemasangan.

## ✨ Fitur

- 🎨 **Design**: Clean Minimalist Modern Glassmorphism (Vanilla Glass + Black)
- 🎭 **Animasi**: Smooth scroll animations, hover effects, glow effects
- 📦 **Produk**: Katalog produk dengan thumbnail, deskripsi, harga, fitur
- 💬 **WhatsApp**: Pesan langsung ke WhatsApp admin
- 🔐 **Admin Dashboard**: Kelola produk dengan password (tanpa email)
- ⚡ **Real-time**: Update produk langsung terlihat
- 📱 **Responsive**: Tampil sempurna di semua device

## 🔑 Password Admin Default

```
van313admin
```

> Ubah password di file `data/config.json` → `adminPassword`

## 🚀 Deploy ke Vercel

### Cara 1: Via GitHub
1. Push project ini ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Klik "New Project" → Import dari GitHub
4. Klik "Deploy"
5. Selesai! Website Anda sudah online

### Cara 2: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd van313-store
vercel

# Deploy ke production
vercel --prod
```

## 📝 Cara Menggunakan

### Admin Dashboard
1. Buka website Anda
2. Klik tombol **"Admin"** di navbar
3. Masukkan password: `van313admin`
4. Kelola produk (Tambah, Edit, Hapus)
5. Atur pengaturan (Nama Toko, Nomor WhatsApp, dll)

### Menambah Produk
1. Login ke Admin Dashboard
2. Klik **"Tambah Produk"**
3. Isi form:
   - **Nama Produk**: Nama template/produk
   - **Harga**: e.g. "Rp 50.000"
   - **Kategori**: e.g. "Website Template"
   - **Deskripsi**: Penjelasan lengkap produk
   - **Fitur**: Pisahkan dengan koma (e.g. "Responsive, Dark Mode, SEO")
   - **URL Thumbnail**: Link gambar produk (opsional)
   - **URL Demo**: Link demo produk (opsional)
4. Klik **"Tambah Produk"**

### Cara Order (Customer)
1. Customer melihat produk di katalog
2. Klik tombol **"Order"** atau **"Pesan via WhatsApp"**
3. Otomatis diarahkan ke WhatsApp dengan pesan template
4. Admin membalas dan mengirim source code via Google Drive

## 📁 Struktur Project

```
van313-store/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Layout utama
│   ├── globals.css           # Styles
│   ├── products/
│   │   ├── page.tsx          # Semua produk
│   │   └── [id]/page.tsx     # Detail produk
│   ├── admin/
│   │   ├── page.tsx          # Login admin
│   │   └── dashboard/page.tsx # Dashboard admin
│   └── api/
│       ├── products/route.ts # API produk (CRUD)
│       ├── config/route.ts   # API pengaturan
│       └── auth/route.ts     # API autentikasi
├── components/
│   ├── Navbar.tsx            # Navigasi
│   ├── Footer.tsx            # Footer
│   ├── ProductCard.tsx       # Card produk
│   ├── ScrollReveal.tsx      # Animasi scroll
│   └── ParticlesBg.tsx       # Background particles
├── data/
│   ├── products.json         # Data produk
│   └── config.json           # Konfigurasi toko
└── package.json
```

## ⚠️ Catatan Penting untuk Vercel

Vercel menggunakan serverless functions, jadi **perubahan data tidak persisten** antar request. 

**Solusi untuk production:**
1. Edit produk di localhost, lalu push ke GitHub (redeploy otomatis)
2. Atau gunakan database eksternal (Vercel KV, Supabase, PlanetScale)

Untuk store kecil-menengah, cara pertama sudah cukup.

## 🎨 Customisasi

### Ganti Warna
Edit `tailwind.config.ts` → `colors`:
```ts
accent: {
  DEFAULT: '#D4A574',  // Ganti warna aksen
}
```

### Ganti Password Admin
Edit `data/config.json`:
```json
{
  "adminPassword": "password_baru_anda"
}
```

### Ganti Nomor WhatsApp
Edit via Admin Dashboard → tab Pengaturan, atau edit `data/config.json`:
```json
{
  "whatsappNumber": "628xxxxxxxxxx"
}
```

---

Made with ❤️ by Van313 Store