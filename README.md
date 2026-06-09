# 🌿 Sistem Informasi KKN 146 — Desa Talang Marap

> Website fullstack modern untuk KKN 146 Universitas Bengkulu — mencakup landing page publik dan dashboard admin lengkap.

**Live:** [kkn-146108.vercel.app](https://kkn-146108.vercel.app)  
**Lokasi KKN:** Desa Talang Marap, Kec. Kelam Tengah, Kab. Kaur, Bengkulu  
**DPL:** Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.

---

## 📋 Daftar Isi

- [Quick Start](#-quick-start)
- [Login Admin](#-login-admin)
- [Setup Database](#-setup-database-supabase)
- [Setup Storage](#-setup-storage-upload-foto--file)
- [Tech Stack](#-tech-stack)
- [Struktur Project](#-struktur-project)
- [Fitur Lengkap](#-fitur-lengkap)
- [Deploy Vercel](#-deploy-ke-vercel)
- [Tim KKN 146](#-tim-kkn-146)

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ReffkiAndreaPratama/KKN146108.git
cd KKN146108

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Buat file .env.local dan isi sesuai contoh di bawah

# 4. Jalankan development server
npm run dev
```

Buka **http://localhost:3000**

### Environment Variables (.env.local)

```env
# Supabase — ambil dari Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Admin Dashboard
NEXT_PUBLIC_ADMIN_USERNAME=  # isi sendiri, tidak dibagikan
NEXT_PUBLIC_ADMIN_PASSWORD=  # isi sendiri, tidak dibagikan

# Opsional — untuk form kontak email (Resend)
# RESEND_API_KEY=re_xxxx
# CONTACT_EMAIL=kkntalangmarap@gmail.com
```

> ⚠️ Jangan pernah commit file `.env.local` ke repository publik.

---

## 🔐 Login Admin

| URL | Keterangan |
|-----|------------|
| `/` | Landing page — dapat diakses siapa saja |
| `/login` | Halaman login admin |
| `/dashboard` | Dashboard — hanya bisa diakses setelah login |

Credentials admin diset melalui environment variable `NEXT_PUBLIC_ADMIN_USERNAME` dan `NEXT_PUBLIC_ADMIN_PASSWORD` — **tidak dicantumkan di sini**.

---

## 🗄️ Setup Database (Supabase)

1. Buat project baru di [supabase.com](https://supabase.com) (gratis)
2. Buka **SQL Editor** → **New query**
3. Copy seluruh isi file `supabase/schema.sql`
4. Paste ke SQL Editor → klik **Run**
5. Semua tabel + seed data + storage policy akan dibuat otomatis

### Tabel yang Dibuat

| Tabel | Fungsi |
|-------|--------|
| `members` | Data anggota KKN |
| `proker` | Program kerja |
| `transactions` | Pemasukan & pengeluaran keuangan |
| `journal` | Jurnal harian kegiatan |
| `attendance` | Absensi anggota per tanggal |
| `dokumentasi` | Galeri foto kegiatan |
| `arsip` | Arsip file digital |
| `inventaris` | Checklist perlengkapan |
| `piket` | Jadwal piket harian |

> **Tanpa Supabase:** App tetap berjalan dengan data statis (seed data hardcoded). Semua halaman dapat diakses dan di-preview.

---

## 📂 Setup Storage (Upload Foto & File)

Bucket storage `photos` digunakan untuk upload foto dokumentasi, foto anggota, dan arsip file.

Jalankan SQL berikut di **Supabase SQL Editor** (sudah termasuk dalam `schema.sql`):

```sql
-- Buat bucket photos (public)
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

-- Storage policies
create policy "Public read storage photos"
  on storage.objects for select using (bucket_id = 'photos');

create policy "Public upload storage photos"
  on storage.objects for insert with check (bucket_id = 'photos');

create policy "Public delete storage photos"
  on storage.objects for delete using (bucket_id = 'photos');
```

---

## 📦 Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | 11.x |
| Charts | Recharts | 2.x |
| Icons | Lucide React | 0.400 |
| State Management | TanStack Query + Zustand | 5.x |
| Database | Supabase (PostgreSQL) | — |
| Storage | Supabase Storage | — |
| Export PDF | jsPDF + jspdf-autotable | 4.x |
| Export Excel | xlsx (SheetJS) | 0.18 |
| Email | Resend (opsional) | 6.x |
| Deploy | Vercel | — |

---

## 📁 Struktur Project

```
KKN146108/
├── public/                     # Static assets
├── supabase/
│   ├── schema.sql              # Schema lengkap + seed data + storage policy
│   └── README.md               # Panduan setup Supabase
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page (publik)
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # Halaman 404
│   │   ├── globals.css         # Global styles
│   │   ├── login/
│   │   │   └── page.tsx        # Halaman login admin
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts    # API endpoint form kontak
│   │   └── dashboard/
│   │       ├── layout.tsx      # Layout dashboard + sidebar
│   │       ├── page.tsx        # Overview & analytics
│   │       ├── anggota/        # Manajemen anggota
│   │       ├── proker/         # Program kerja
│   │       ├── keuangan/       # Laporan keuangan
│   │       ├── inventory/      # Inventaris perlengkapan
│   │       ├── arsip/          # Arsip digital
│   │       ├── dokumentasi/    # Galeri foto
│   │       ├── jurnal/         # Jurnal harian
│   │       ├── absensi/        # Absensi anggota
│   │       ├── piket/          # Jadwal piket
│   │       └── export/         # Export laporan
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── sections/           # Semua section landing page
│   │   ├── dashboard/          # Sidebar, Header, AuthGuard
│   │   ├── providers/          # QueryProvider, ThemeProvider
│   │   └── ui/                 # Card, Modal, Badge, dll
│   ├── hooks/                  # Custom hooks (useMembers, useProker, dll)
│   ├── lib/                    # Utilities (supabase, auth, export, utils)
│   ├── data/                   # Seed data statis fallback
│   └── types/                  # TypeScript type definitions
├── .env.local                  # Environment variables (jangan di-commit!)
├── next.config.ts
├── tailwind.config
└── tsconfig.json
```

---

## ✨ Fitur Lengkap

### 🌐 Landing Page (Publik)

| Section | Fitur |
|---------|-------|
| **Hero** | Animated gradient, countdown timer, tombol CTA |
| **Tentang Desa** | Profil desa, statistik, Google Maps embed |
| **Tim KKN** | Grid anggota + card DPL, modal detail, data live dari DB |
| **Program Kerja** | Filter kategori, progress bar, status badge |
| **Timeline** | Riwayat kegiatan dengan visual timeline |
| **Galeri** | Grid foto dengan filter kategori + lightbox |
| **Keuangan** | Pie chart distribusi + bar chart + riwayat transaksi |
| **Inventaris** | Checklist perlengkapan dengan status |
| **Jadwal Piket** | Tampilan mingguan |
| **Kontak** | Form kirim pesan + info kontak |

### 🖥️ Dashboard Admin

| Modul | Fitur |
|-------|-------|
| **Overview** | Statistik, charts, rekap kegiatan terbaru |
| **Anggota** | CRUD lengkap, upload foto, view card/table |
| **Program Kerja** | Kanban board + table view, CRUD, filter status |
| **Keuangan** | Tambah transaksi, pie chart, bar chart, saldo |
| **Inventaris** | Checklist interaktif, filter, tambah/edit/hapus |
| **Arsip Digital** | Upload file, Buka, Unduh, Edit, Hapus |
| **Dokumentasi** | Upload foto, galeri 4 kolom, filter kategori, CRUD |
| **Jurnal Harian** | CRUD catatan, filter prioritas, tags |
| **Absensi** | Navigator tanggal, toggle status, catatan, rekap mingguan |
| **Jadwal Piket** | Navigator minggu, rotasi otomatis |
| **Export Laporan** | Export Anggota, Proker, Keuangan, Inventaris, Absensi — PDF & Excel |

### 📤 Export

Semua modul mendukung export dengan desain profesional:
- **PDF** — header KKN 146, summary box, tabel berformat, footer
- **Excel** — kolom otomatis, sheet terpisah per modul
- **Absensi** — filter rentang tanggal sebelum export

---

## 🌐 Deploy ke Vercel

### Via Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Via GitHub Integration

1. Push repo ke GitHub
2. Import project di [vercel.com](https://vercel.com/new)
3. Tambah environment variables di **Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_ADMIN_USERNAME
NEXT_PUBLIC_ADMIN_PASSWORD
```

4. Klik **Deploy**

### Build Commands

```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # ESLint check
```

---

## 👥 Tim KKN 146

| No | Nama | NIM | Divisi | Jabatan |
|----|------|-----|--------|---------|
| 1 | Muhammad Pin Ping Anugerah H.T.P | G1B023087 | Ketua | Ketua KKN 146 |
| 2 | Reffki Andrea Pratama | G1A023039 | PDD | Koordinator PDD |
| 3 | Rezi Nopitri Yadi | E1C023048 | Humas & Acara | Humas & Koordinator Acara |
| 4 | Maulana Ahmad Danil | CIA023063 | Humas | Humas |
| 5 | Revina Anggraeni | A1A023051 | Sekretaris | Sekretaris |
| 6 | Ferlin Fernandes | D1B023062 | PDD | Anggota PDD |
| 7 | Hafizah Khairannisa | BIA023221 | Acara | Koordinator Acara |
| 8 | Bella Alfia | C1B023105 | Bendahara | Bendahara |

**DPL:** Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.  
**Universitas:** Universitas Bengkulu

---

## 📞 Kontak

- 📧 Email: [kkntalangmarap@gmail.com](mailto:kkntalangmarap@gmail.com)
- 📱 WhatsApp: [+62 895-2380-7738](https://wa.me/6289523807738)
- 📸 Instagram: [@kkn146_talangmarap](https://instagram.com/kkn146_talangmarap)
- 📍 Lokasi: Desa Talang Marap, Kec. Kelam Tengah, Kab. Kaur, Bengkulu

---

© 2026 KKN 146 Desa Talang Marap — Universitas Bengkulu
