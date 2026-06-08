# Setup Supabase untuk KKN 146

## Langkah-langkah

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → Sign up gratis
2. Klik **New Project**
3. Isi nama project: `kkn-146-talang-marap`
4. Pilih region terdekat (Singapore)
5. Buat password database yang kuat
6. Klik **Create new project** dan tunggu ~2 menit

### 2. Jalankan Schema SQL
1. Di dashboard Supabase, buka **SQL Editor**
2. Klik **New query**
3. Copy seluruh isi file `supabase/schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** (Ctrl+Enter)
6. Semua tabel + seed data + storage bucket akan dibuat otomatis

### 3. Ambil API Keys
1. Buka **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Update .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Restart Dev Server
```bash
npm run dev
```

## Tabel yang Dibuat

| Tabel | Fungsi |
|-------|--------|
| `members` | Data anggota KKN (CRUD lengkap) |
| `proker` | Program kerja (CRUD + kanban) |
| `transactions` | Keuangan pemasukan/pengeluaran |
| `journal` | Jurnal harian kegiatan |
| `attendance` | Absensi anggota |

## Fitur Database

- ✅ **Seed data otomatis** — 8 anggota + 8 proker + 10 transaksi langsung terisi
- ✅ **Row Level Security** — data aman, public bisa baca
- ✅ **Auto updated_at** — timestamp otomatis update
- ✅ **UUID primary keys** — ID unik untuk setiap record
- ✅ **Fallback ke static data** — jika DB belum dikonfigurasi, app tetap jalan
- ✅ **Storage bucket `photos`** — untuk upload foto dokumentasi, arsip, dan foto anggota

## Deploy ke Vercel

Tambahkan environment variables di Vercel:
1. Buka project di vercel.com → **Settings** → **Environment Variables**
2. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy
