"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Search, X, ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

type GalleryCategory = "Semua" | "Survey" | "Rapat" | "Kegiatan" | "Gotong Royong" | "Pendidikan" | "Sosialisasi";

interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "Semua">;
  date: string;
  color: string;
  emoji: string;
  uploader: string;
}

const SEED: GalleryItem[] = [
  { id: "1",  title: "Survey Lokasi KKN",      category: "Survey",        date: "14 Mei 2026",  color: "from-emerald-600 to-teal-500",  emoji: "🗺️",  uploader: "Reffki" },
  { id: "2",  title: "Rapat Koordinasi Tim",   category: "Rapat",         date: "16 Mei 2026",  color: "from-cyan-600 to-blue-500",     emoji: "👥",  uploader: "Revina" },
  { id: "3",  title: "Penerimaan di Desa",     category: "Kegiatan",      date: "29 Mei 2026",  color: "from-violet-600 to-purple-500", emoji: "🏡",  uploader: "Reffki" },
  { id: "4",  title: "Gotong Royong Desa",     category: "Gotong Royong", date: "7 Jun 2026",   color: "from-amber-600 to-orange-500",  emoji: "🌿",  uploader: "Ferlin" },
  { id: "5",  title: "Bimbel Anak SD",         category: "Pendidikan",    date: "1 Jun 2026",   color: "from-pink-600 to-rose-500",     emoji: "📚",  uploader: "Ferlin" },
  { id: "6",  title: "Sosialisasi Kesehatan",  category: "Sosialisasi",   date: "10 Jun 2026",  color: "from-red-600 to-pink-500",      emoji: "🏥",  uploader: "Reffki" },
  { id: "7",  title: "Pelatihan UMKM",         category: "Kegiatan",      date: "5 Jun 2026",   color: "from-indigo-600 to-blue-500",   emoji: "💼",  uploader: "Ferlin" },
  { id: "8",  title: "Pengajian Rutin",        category: "Kegiatan",      date: "3 Jun 2026",   color: "from-teal-600 to-emerald-500",  emoji: "🕌",  uploader: "Reffki" },
  { id: "9",  title: "Rapat Evaluasi",         category: "Rapat",         date: "15 Jun 2026",  color: "from-slate-600 to-gray-500",    emoji: "📋",  uploader: "Revina" },
  { id: "10", title: "Kegiatan Posyandu",      category: "Sosialisasi",   date: "12 Jun 2026",  color: "from-rose-600 to-red-500",      emoji: "👶",  uploader: "Ferlin" },
  { id: "11", title: "Pemasangan Spanduk",     category: "Kegiatan",      date: "30 Mei 2026",  color: "from-sky-600 to-cyan-500",      emoji: "🎌",  uploader: "Reffki" },
  { id: "12", title: "Kunjungan Sekolah",      category: "Pendidikan",    date: "2 Jun 2026",   color: "from-lime-600 to-green-500",    emoji: "🏫",  uploader: "Ferlin" },
];

const CATEGORIES: GalleryCategory[] = ["Semua", "Survey", "Rapat", "Kegiatan", "Gotong Royong", "Pendidikan", "Sosialisasi"];

const COLOR_OPTIONS = [
  "from-emerald-600 to-teal-500", "from-cyan-600 to-blue-500",
  "from-violet-600 to-purple-500", "from-amber-600 to-orange-500",
  "from-pink-600 to-rose-500", "from-indigo-600 to-blue-500",
];

const EMOJIS = ["🗺️", "👥", "🏡", "🌿", "📚", "🏥", "💼", "🕌", "📋", "🎌", "🏫", "👶", "🌾", "🎓", "🤝"];

/* ─── Upload Modal ────────────────────────────────────────── */
function UploadModal({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void;
  onAdd: (item: GalleryItem) => void;
}) {
  const [form, setForm] = useState({
    title: "", category: "Kegiatan" as Exclude<GalleryCategory, "Semua">,
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    uploader: "", color: COLOR_OPTIONS[0], emoji: "📸",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ id: Date.now().toString(), ...form });
    setForm({ title: "", category: "Kegiatan", date: form.date, uploader: "", color: COLOR_OPTIONS[0], emoji: "📸" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Foto" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-white/[0.2] bg-white/[0.02] cursor-pointer transition-all">
          <Upload className="w-8 h-8 text-slate-500" />
          <div className="text-center">
            <p className="text-slate-300 text-sm font-medium">Klik untuk pilih foto</p>
            <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP (maks 10MB)</p>
          </div>
          <input type="file" accept="image/*" className="absolute opacity-0 w-full h-full cursor-pointer" />
        </div>

        {/* Emoji picker */}
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-2">Ikon Placeholder</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((em) => (
              <button
                key={em} type="button"
                onClick={() => setForm({ ...form, emoji: em })}
                className={cn(
                  "w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all",
                  form.emoji === em
                    ? "bg-emerald-500/20 ring-2 ring-emerald-500/50 scale-110"
                    : "bg-white/[0.05] hover:bg-white/[0.09]"
                )}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-2">Warna Background</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c} type="button"
                onClick={() => setForm({ ...form, color: c })}
                className={cn(
                  "w-8 h-8 rounded-xl bg-gradient-to-br transition-all", c,
                  form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d1526] scale-110" : "opacity-60 hover:opacity-100"
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Judul Foto *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Judul kegiatan" className="input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Kategori</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Exclude<GalleryCategory, "Semua"> })} className="input">
              {CATEGORIES.filter((c) => c !== "Semua").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Uploader</label>
            <input value={form.uploader} onChange={(e) => setForm({ ...form, uploader: e.target.value })} placeholder="Nama anggota" className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1 justify-center py-3">
            <Plus className="w-4 h-4" />Tambah
          </button>
          <button type="button" onClick={onClose} className="btn-ghost py-3 px-5">
            <X className="w-4 h-4" />Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Lightbox ────────────────────────────────────────────── */
function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: GalleryItem[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      {index > 0 && (
        <button className="absolute left-5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {index < items.length - 1 && (
        <button className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); onNext(); }}>
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      <motion.div
        key={index}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full h-72 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
          <span className="text-8xl select-none">{item.emoji}</span>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-white font-bold text-xl">{item.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{item.date} · {item.category} · oleh {item.uploader}</p>
          <p className="text-slate-600 text-xs mt-1">{index + 1} / {items.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function DokumentasiDashboardPage() {
  const [items, setItems]               = useState<GalleryItem[]>(SEED);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("Semua");
  const [search, setSearch]             = useState("");
  const [showUpload, setShowUpload]     = useState(false);
  const [lightboxIdx, setLightboxIdx]   = useState<number | null>(null);

  const filtered = items.filter((g) => {
    const catOk    = activeCategory === "Semua" || g.category === activeCategory;
    const searchOk = g.title.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  const handleDelete = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dokumentasi</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} foto kegiatan</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          Upload Foto
        </button>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari foto..." className="input pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activeCategory === cat
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.07]"
              )}
            >
              {cat}
              {cat !== "Semua" && <span className="ml-1.5 opacity-50">{items.filter((i) => i.category === cat).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Gallery Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Tidak ada foto ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="group cursor-pointer"
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-emerald-500/25 transition-all aspect-square"
                onClick={() => setLightboxIdx(i)}
              >
                <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <span className="text-4xl select-none">{item.emoji}</span>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-3">
                  <div>
                    <p className="text-white font-semibold text-xs leading-snug">{item.title}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">{item.date}</p>
                  </div>
                </div>
                {/* Delete btn */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/60 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {/* Category tag */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2 truncate">{item.title}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onAdd={(item) => setItems((p) => [item, ...p])} />

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((i) => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setLightboxIdx((i) => Math.min(filtered.length - 1, (i ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
