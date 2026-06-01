# 🌿 Sistem Informasi KKN 146 Desa Talang Marap

> Website modern fullstack production-ready — KKN 146 Universitas Bengkulu

**Lokasi:** Desa Talang Marap, Kecamatan Kelam Tengah, Kabupaten Kaur, Provinsi Bengkulu  
**Universitas:** Universitas Bengkulu — Fakultas Teknik — Informatika

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup environment
cp .env.local.example .env.local
# Edit .env.local dengan credentials Supabase kamu

# 3. Jalankan dev server
npm run dev
```

Buka **http://localhost:3000**

---

## 🔐 Login Admin

| URL | Akses |
|-----|-------|
| `/` | Landing page (publik) |
| `/login` | Halaman login admin |
| `/dashboard` | Dashboard (butuh login) |

**Default credentials** (ubah di `.env.local`):
```
Username: 
Password: 
```

---

## 🗄️ Setup Database (Supabase)

1. Buat project di [supabase.com](https://supabase.com) (gratis)
2. Buka **SQL Editor** → **New query**
3. Copy-paste isi `supabase/schema.sql` → **Run**
4. Buka **Settings → API** → copy URL & anon key
5. Isi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=passwordkamu
```

> **Tanpa Supabase:** App tetap jalan dengan data statis (seed data)

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand + TanStack Query |
| Database | Supabase (PostgreSQL) |
| Export | jsPDF + jspdf-autotable + xlsx |
| Auth | Session-based (Supabase ready) |

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx              # Landing page (publik)
│   ├── login/                # Halaman login admin
│   ├── not-found.tsx         # 404 page
│   └── dashboard/
│       ├── page.tsx          # Overview analytics
│       ├── anggota/          # CRUD anggota
│       ├── proker/           # Program kerja (kanban + table)
│       ├── keuangan/         # Laporan keuangan + charts
│       ├── inventory/        # Checklist inventaris
│       ├── arsip/            # Arsip digital (upload/download)
│       ├── dokumentasi/      # Galeri foto
│       ├── jurnal/           # Jurnal harian
│       ├── absensi/          # Absensi anggota
│       ├── piket/            # Jadwal piket otomatis
│       └── export/           # Export semua laporan
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Landing page sections
│   ├── dashboard/            # Sidebar, Header, AuthGuard
│   └── ui/                   # Card, Modal, Badge, ExportButton
├── hooks/                    # useMembers, useProker, dll
├── lib/                      # utils, supabase, auth, export
├── data/                     # Seed data statis
└── types/                    # TypeScript types
```

---

## ✨ Fitur Lengkap

### Landing Page
- Hero dengan animated gradient + countdown timer
- Navbar sticky + dark mode + mobile responsive
- Tentang Desa + Google Maps embed
- Tim KKN dengan modal detail + data dari DB
- Program Kerja dengan filter + progress bar
- Timeline kegiatan
- Galeri dokumentasi + lightbox
- Laporan keuangan + charts
- Checklist inventaris
- Form kontak

### Dashboard Admin (Login Required)
- **Overview** — analytics, charts, recent activity
- **Anggota** — CRUD lengkap, cards + table, export PDF/Excel
- **Program Kerja** — Kanban board + table view, CRUD, export
- **Keuangan** — Pie chart + bar chart, tambah transaksi, export
- **Inventaris** — Checklist interaktif, filter kategori, export
- **Arsip Digital** — Upload file, grid/list view, filter kategori
- **Dokumentasi** — Upload foto, galeri, lightbox, filter
- **Jurnal Harian** — CRUD catatan, filter prioritas, tags
- **Absensi** — Navigator tanggal, toggle status, export
- **Jadwal Piket** — Rotasi otomatis, navigator minggu
- **Export Laporan** — Export semua laporan PDF + Excel sekaligus

---

## 🌐 Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Atau push ke GitHub → import di [vercel.com](https://vercel.com) → tambah env vars → deploy.

**Environment Variables di Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_USERNAME
NEXT_PUBLIC_ADMIN_PASSWORD
```

---

## 👥 Tim KKN 146

| No | Nama | NIM | Divisi |
|----|------|-----|--------|
| 1 | Reffki Andrea Pratama | G1A023039 | PDD |
| 2 | Rezi Nopitri Yadi | E1C023048 | Humas & Acara |
| 3 | Muhammad Pin Ping Anugerah... | G1B023087 | **Ketua** |
| 4 | Maulana Ahmad Danil | CIA023063 | Humas |
| 5 | Revina Anggraeni | A1A023051 | Sekretaris |
| 6 | Ferlin Fernandes | D1B023062 | PDD |
| 7 | Hafizah Khairannisa | BIA023221 | Acara |
| 8 | Bella Alfia | C1B023105 | Bendahara |

---

© 2026 KKN 146 Desa Talang Marap — Universitas Bengkulu
