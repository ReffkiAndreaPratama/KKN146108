-- ============================================================
-- KKN 146 Desa Talang Marap — Supabase Schema
-- Aman dijalankan berulang kali (idempotent)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── MEMBERS ────────────────────────────────────────────────
create table if not exists members (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  nim          text not null unique,
  division     text not null,
  role         text not null,
  faculty      text not null,
  prodi        text not null,
  gender       text not null default 'Laki-Laki',
  quote        text,
  instagram    text,
  whatsapp     text,
  photo_url    text,
  color        text not null default 'from-emerald-500 to-cyan-500',
  initials     text not null,
  dpl          text,
  dpl_photo_url text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Migrasi: tambah kolom dpl jika belum ada (untuk database lama)
alter table members add column if not exists dpl text;
alter table members add column if not exists dpl_photo_url text;

-- ─── PROKER ─────────────────────────────────────────────────
create table if not exists proker (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  description     text not null,
  category        text not null,
  ketua_pelaksana text not null,
  anggota         text[] not null default '{}',
  start_date      date not null,
  end_date        date not null,
  target          text not null,
  progress        integer not null default 0 check (progress >= 0 and progress <= 100),
  status          text not null default 'planning' check (status in ('planning','ongoing','completed')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── TRANSACTIONS ────────────────────────────────────────────
create table if not exists transactions (
  id          uuid primary key default uuid_generate_v4(),
  type        text not null check (type in ('income','expense')),
  description text not null,
  amount      bigint not null check (amount > 0),
  date        date not null,
  category    text not null,
  created_by  text not null,
  created_at  timestamptz default now()
);

-- ─── JOURNAL ─────────────────────────────────────────────────
create table if not exists journal (
  id         uuid primary key default uuid_generate_v4(),
  date       date not null,
  title      text not null,
  content    text not null,
  priority   text not null default 'medium' check (priority in ('low','medium','high')),
  tags       text[] not null default '{}',
  author     text not null,
  created_at timestamptz default now()
);

-- ─── ATTENDANCE ──────────────────────────────────────────────
create table if not exists attendance (
  id          uuid primary key default uuid_generate_v4(),
  member_id   uuid references members(id) on delete cascade,
  member_name text not null,
  date        date not null,
  status      text not null default 'hadir' check (status in ('hadir','izin','sakit','alpha')),
  note        text,
  created_at  timestamptz default now(),
  unique(member_id, date)
);

-- ─── DOKUMENTASI ─────────────────────────────────────────────
create table if not exists dokumentasi (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  category    text not null default 'Kegiatan',
  date        date not null,
  photo_url   text,
  description text,
  uploader    text not null default 'Admin',
  created_at  timestamptz default now()
);

alter table dokumentasi add column if not exists description text;

-- ─── ARSIP ───────────────────────────────────────────────────
create table if not exists arsip (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null default 'Administrasi',
  file_url    text not null,
  file_type   text not null default 'pdf',
  size_bytes  bigint not null default 0,
  uploader    text not null default 'Admin',
  created_at  timestamptz default now()
);

-- ─── INVENTARIS ──────────────────────────────────────────────
create table if not exists inventaris (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null default 'sekretariat',
  quantity    integer not null default 1,
  unit        text not null default 'buah',
  owner       text,
  status      text not null default 'tersedia' check (status in ('tersedia','kurang','tidak_ada')),
  checked     boolean not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── AUTO UPDATE updated_at ──────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists members_updated_at on members;
create trigger members_updated_at before update on members
  for each row execute function update_updated_at();

drop trigger if exists proker_updated_at on proker;
create trigger proker_updated_at before update on proker
  for each row execute function update_updated_at();

alter table dokumentasi  enable row level security;
alter table arsip        enable row level security;
alter table inventaris   enable row level security;

drop policy if exists "public read dokumentasi"  on dokumentasi;
drop policy if exists "public read arsip"        on arsip;
drop policy if exists "public read inventaris"   on inventaris;
drop policy if exists "anon write dokumentasi"   on dokumentasi;
drop policy if exists "anon write arsip"         on arsip;
drop policy if exists "anon write inventaris"    on inventaris;

create policy "public read dokumentasi"  on dokumentasi  for select using (true);
create policy "public read arsip"        on arsip        for select using (true);
create policy "public read inventaris"   on inventaris   for select using (true);
create policy "anon write dokumentasi"   on dokumentasi  for all using (true) with check (true);
create policy "anon write arsip"         on arsip        for all using (true) with check (true);
create policy "anon write inventaris"    on inventaris   for all using (true) with check (true);

drop trigger if exists inventaris_updated_at on inventaris;
create trigger inventaris_updated_at before update on inventaris
  for each row execute function update_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table members      enable row level security;
alter table proker       enable row level security;
alter table transactions enable row level security;
alter table journal      enable row level security;
alter table attendance   enable row level security;

-- Public read
drop policy if exists "public read members"      on members;
drop policy if exists "public read proker"       on proker;
drop policy if exists "public read transactions" on transactions;
drop policy if exists "public read journal"      on journal;
drop policy if exists "public read attendance"   on attendance;

create policy "public read members"      on members      for select using (true);
create policy "public read proker"       on proker       for select using (true);
create policy "public read transactions" on transactions  for select using (true);
create policy "public read journal"      on journal      for select using (true);
create policy "public read attendance"   on attendance   for select using (true);

-- Anon write (demo — ganti dengan auth di production)
drop policy if exists "anon write members"      on members;
drop policy if exists "anon write proker"       on proker;
drop policy if exists "anon write transactions" on transactions;
drop policy if exists "anon write journal"      on journal;
drop policy if exists "anon write attendance"   on attendance;

create policy "anon write members"      on members      for all using (true) with check (true);
create policy "anon write proker"       on proker       for all using (true) with check (true);
create policy "anon write transactions" on transactions  for all using (true) with check (true);
create policy "anon write journal"      on journal      for all using (true) with check (true);
create policy "anon write attendance"   on attendance   for all using (true) with check (true);

-- ─── SEED DATA — MEMBERS ─────────────────────────────────────
insert into members (name, nim, division, role, faculty, prodi, gender, quote, instagram, color, initials, dpl) values
  ('Reffki Andrea Pratama',                        'G1A023039', 'PDD',           'Koordinator PDD',         'Fakultas Teknik',                       'Informatika',                      'Laki-Laki', 'Setiap momen berharga untuk diabadikan.',             'reffki_andrea',    'from-indigo-500 to-blue-600',   'RA', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Rezi Nopitri Yadi',                            'E1C023048', 'Humas & Acara', 'Humas & Koordinator Acara','Fakultas Pertanian',                    'Peternakan',                       'Laki-Laki', 'Setiap acara adalah kenangan yang tak terlupakan.',   'rezi_nopitri',     'from-amber-500 to-orange-600',  'RN', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Muhammad Pin Ping Anugerah Hariah Tama Putra', 'G1B023087', 'Ketua',         'Ketua KKN 146',           'Fakultas Teknik',                       'Teknik Sipil',                     'Laki-Laki', 'Memimpin dengan hati, membangun dengan karya.',       'pinping_kkn',      'from-emerald-500 to-teal-600',  'PP', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Maulana Ahmad Danil',                          'CIA023063', 'Humas',         'Humas',                   'Fakultas Ekonomi dan Bisnis',           'Ekonomi Pembangunan',              'Laki-Laki', 'Komunikasi adalah kunci keberhasilan.',               'danil_maulana',    'from-cyan-500 to-sky-600',      'MD', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Revina Anggraeni',                             'A1A023051', 'Sekretaris',    'Sekretaris',              'Fakultas Keguruan dan Ilmu Pendidikan', 'Pendidikan Bahasa Indonesia',      'Perempuan', 'Administrasi rapi, kegiatan lancar.',                 'revina_anggraeni', 'from-pink-500 to-rose-600',     'RA', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Ferlin Fernandes',                             'D1B023062', 'PDD',           'Anggota PDD',             'Fakultas Ilmu Sosial dan Ilmu Politik', 'Perpustakaan dan Sains Informasi', 'Perempuan', 'Dokumentasi terbaik untuk kenangan abadi.',           'ferlin_fernandes', 'from-violet-500 to-purple-600', 'FF', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Hafizah Khairannisa',                          'BIA023221', 'Acara',         'Koordinator Acara',       'Fakultas Hukum',                        'Ilmu Hukum',                       'Perempuan', 'Kreativitas tanpa batas untuk desa yang lebih baik.', 'hafizah_nisa',     'from-fuchsia-500 to-pink-600',  'HK', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'),
  ('Bella Alfia',                                  'C1B023105', 'Bendahara',     'Bendahara',               'Fakultas Ekonomi dan Bisnis',           'Manajemen',                        'Perempuan', 'Keuangan transparan, kepercayaan terjaga.',           'bella_alfia',      'from-rose-500 to-red-600',      'BA', 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.')
on conflict (nim) do nothing;

-- ─── SEED DATA — PROKER ──────────────────────────────────────
insert into proker (name, description, category, ketua_pelaksana, anggota, start_date, end_date, target, progress, status) values
  ('Bimbingan Belajar Anak SD',
   'Program bimbingan belajar gratis untuk anak-anak SD di Desa Talang Marap, fokus pada Matematika, IPA, dan Bahasa Indonesia.',
   'pendidikan', 'Hafizah Khairannisa',
   ARRAY['Revina Anggraeni','Bella Alfia','Ferlin Fernandes'],
   '2026-06-01', '2026-07-15', '30 siswa SD', 65, 'ongoing'),

  ('Digitalisasi UMKM Desa',
   'Membantu pelaku UMKM desa untuk go digital dengan pembuatan akun marketplace, media sosial bisnis, dan pelatihan pemasaran online.',
   'umkm', 'Muhammad Pin Ping Anugerah Hariah Tama Putra',
   ARRAY['Maulana Ahmad Danil','Rezi Nopitri Yadi','Reffki Andrea Pratama'],
   '2026-06-05', '2026-07-20', '10 UMKM', 40, 'ongoing'),

  ('Gotong Royong Kebersihan',
   'Kegiatan gotong royong membersihkan lingkungan desa, sungai, dan fasilitas umum bersama warga.',
   'lingkungan', 'Maulana Ahmad Danil',
   ARRAY['Semua Anggota'],
   '2026-06-07', '2026-06-07', 'Seluruh area desa', 100, 'completed'),

  ('Sosialisasi Kesehatan',
   'Penyuluhan kesehatan tentang PHBS, gizi balita, dan pencegahan penyakit.',
   'kesehatan', 'Bella Alfia',
   ARRAY['Revina Anggraeni','Hafizah Khairannisa'],
   '2026-06-10', '2026-06-10', '100 warga', 0, 'planning'),

  ('Pembuatan Website Desa',
   'Membantu desa membuat website resmi untuk informasi desa, potensi wisata, dan layanan administrasi online.',
   'teknologi', 'Reffki Andrea Pratama',
   ARRAY['Muhammad Pin Ping Anugerah Hariah Tama Putra','Ferlin Fernandes'],
   '2026-06-15', '2026-07-25', '1 website desa', 20, 'ongoing'),

  ('Pengajian & Kegiatan Keagamaan',
   'Mengadakan pengajian rutin, TPA untuk anak-anak, dan kegiatan keagamaan bersama masyarakat desa.',
   'keagamaan', 'Rezi Nopitri Yadi',
   ARRAY['Hafizah Khairannisa','Bella Alfia'],
   '2026-06-01', '2026-07-30', 'Seluruh warga', 50, 'ongoing'),

  ('Pembuatan Profil Desa',
   'Menyusun profil desa yang komprehensif meliputi data kependudukan, potensi desa, dan sejarah desa.',
   'administrasi', 'Revina Anggraeni',
   ARRAY['Bella Alfia','Maulana Ahmad Danil'],
   '2026-06-03', '2026-07-10', '1 buku profil', 75, 'ongoing'),

  ('Pelatihan Komputer Dasar',
   'Pelatihan penggunaan komputer dasar untuk perangkat desa dan masyarakat umum.',
   'teknologi', 'Ferlin Fernandes',
   ARRAY['Reffki Andrea Pratama','Muhammad Pin Ping Anugerah Hariah Tama Putra'],
   '2026-06-20', '2026-07-05', '20 peserta', 0, 'planning')
on conflict do nothing;

-- ─── SEED DATA — TRANSACTIONS ────────────────────────────────
-- (kosong — isi manual via dashboard)

-- ─── PIKET ───────────────────────────────────────────────────
create table if not exists piket (
  id          uuid primary key default uuid_generate_v4(),
  date        date not null unique,
  members     text[] not null default '{}',
  tasks       text[] not null default '{}',
  completed   boolean not null default false,
  note        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table piket enable row level security;
drop policy if exists "public read piket" on piket;
drop policy if exists "anon write piket"  on piket;
create policy "public read piket" on piket for select using (true);
create policy "anon write piket"  on piket for all using (true) with check (true);

drop trigger if exists piket_updated_at on piket;
create trigger piket_updated_at before update on piket
  for each row execute function update_updated_at();

-- ─── UPDATE DPL untuk data yang sudah ada ────────────────────
-- Jalankan ini jika anggota sudah ada di database tapi dpl masih NULL
update members
set dpl = 'Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.'
where dpl is null;

-- ─── STORAGE BUCKET & POLICIES ───────────────────────────────
-- Buat bucket "photos" sebagai public bucket (skip jika sudah ada)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  10485760,  -- 10 MB max per file
  ARRAY['image/jpeg','image/png','image/webp','image/gif',
        'application/pdf','application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do update set public = true;

-- Storage policies — izinkan siapa saja baca & upload ke bucket "photos"
drop policy if exists "Public read storage photos"   on storage.objects;
drop policy if exists "Public upload storage photos"  on storage.objects;
drop policy if exists "Public delete storage photos"  on storage.objects;

create policy "Public read storage photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Public upload storage photos"
  on storage.objects for insert
  with check (bucket_id = 'photos');

create policy "Public delete storage photos"
  on storage.objects for delete
  using (bucket_id = 'photos');
