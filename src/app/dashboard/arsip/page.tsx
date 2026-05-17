"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Upload, Search, FileText, File,
  ImageIcon, Download, Eye, Trash2, X, Plus,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

/* ─── types ───────────────────────────────────────────────── */
type FileCategory = "Semua" | "Proposal" | "LPJ" | "Surat" | "Administrasi" | "Proker" | "Keuangan" | "Dokumentasi";

interface ArsipFile {
  id: string;
  name: string;
  category: Exclude<FileCategory, "Semua">;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

/* ─── seed data ───────────────────────────────────────────── */
const SEED_FILES: ArsipFile[] = [
  { id: "1",  name: "Proposal KKN 146.pdf",        category: "Proposal",      type: "pdf",  size: "2.4 MB",  uploadedBy: "Revina",  date: "2026-05-10" },
  { id: "2",  name: "Surat Izin Lokasi.docx",       category: "Surat",         type: "docx", size: "156 KB",  uploadedBy: "Ping",    date: "2026-05-12" },
  { id: "3",  name: "RAB KKN 146.xlsx",             category: "Keuangan",      type: "xlsx", size: "89 KB",   uploadedBy: "Bella",   date: "2026-05-15" },
  { id: "4",  name: "Proker Pendidikan.pdf",         category: "Proker",        type: "pdf",  size: "1.2 MB",  uploadedBy: "Hafizah", date: "2026-05-20" },
  { id: "5",  name: "Dokumentasi Survey.jpg",        category: "Dokumentasi",   type: "jpg",  size: "3.8 MB",  uploadedBy: "Reffki",  date: "2026-05-15" },
  { id: "6",  name: "Absensi Minggu 1.xlsx",         category: "Administrasi",  type: "xlsx", size: "45 KB",   uploadedBy: "Revina",  date: "2026-06-07" },
  { id: "7",  name: "LPJ Gotong Royong.pdf",         category: "LPJ",           type: "pdf",  size: "890 KB",  uploadedBy: "Danil",   date: "2026-06-08" },
  { id: "8",  name: "Surat Permohonan.docx",         category: "Surat",         type: "docx", size: "120 KB",  uploadedBy: "Revina",  date: "2026-06-01" },
  { id: "9",  name: "Laporan Keuangan Minggu 1.pdf", category: "Keuangan",      type: "pdf",  size: "540 KB",  uploadedBy: "Bella",   date: "2026-06-08" },
  { id: "10", name: "Profil Desa Draft.docx",        category: "Administrasi",  type: "docx", size: "230 KB",  uploadedBy: "Revina",  date: "2026-06-05" },
];

const CATEGORIES: FileCategory[] = ["Semua", "Proposal", "LPJ", "Surat", "Administrasi", "Proker", "Keuangan", "Dokumentasi"];

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, docx: File, xlsx: File, jpg: ImageIcon, png: ImageIcon,
};

const FILE_COLORS: Record<string, string> = {
  pdf:  "text-red-400 bg-red-500/10 border-red-500/20",
  docx: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  xlsx: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  jpg:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  png:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const CAT_COLORS: Record<string, string> = {
  Proposal:     "bg-violet-500/10 text-violet-400 border-violet-500/20",
  LPJ:          "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Surat:        "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Administrasi: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Proker:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Keuangan:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Dokumentasi:  "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

/* ─── Upload Modal ────────────────────────────────────────── */
function UploadModal({
  open, onClose, onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: ArsipFile) => void;
}) {
  const [form, setForm] = useState({
    name: "", category: "Administrasi" as Exclude<FileCategory, "Semua">, uploadedBy: "",
  });
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setForm((p) => ({ ...p, name: p.name || f.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ext = (fileName || form.name).split(".").pop() ?? "pdf";
    onUpload({
      id: Date.now().toString(),
      name: form.name || fileName,
      category: form.category,
      type: ext,
      size: "—",
      uploadedBy: form.uploadedBy || "Admin",
      date: new Date().toISOString().split("T")[0],
    });
    setForm({ name: "", category: "Administrasi", uploadedBy: "" });
    setFileName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload File" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) { setFileName(f.name); setForm((p) => ({ ...p, name: p.name || f.name })); }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer",
            dragging
              ? "border-emerald-500/60 bg-emerald-500/[0.06]"
              : "border-white/[0.12] hover:border-white/[0.2] bg-white/[0.02]"
          )}
        >
          <input
            type="file"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          <Upload className={cn("w-8 h-8", dragging ? "text-emerald-400" : "text-slate-500")} />
          {fileName ? (
            <div className="text-center">
              <p className="text-white font-medium text-sm">{fileName}</p>
              <p className="text-slate-500 text-xs mt-0.5">File dipilih</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-300 text-sm font-medium">Drag & drop atau klik untuk pilih file</p>
              <p className="text-slate-500 text-xs mt-1">PDF, DOCX, XLSX, JPG, PNG</p>
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Nama File *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Nama dokumen"
            className="input"
          />
        </div>

        {/* Category + Uploader */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Exclude<FileCategory, "Semua"> })}
              className="input"
            >
              {CATEGORIES.filter((c) => c !== "Semua").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Diupload oleh</label>
            <input
              value={form.uploadedBy}
              onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })}
              placeholder="Nama anggota"
              className="input"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1 justify-center py-3">
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button type="button" onClick={onClose} className="btn-ghost py-3 px-5">
            <X className="w-4 h-4" />
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ArsipPage() {
  const [files, setFiles]               = useState<ArsipFile[]>(SEED_FILES);
  const [activeCategory, setActiveCategory] = useState<FileCategory>("Semua");
  const [search, setSearch]             = useState("");
  const [showUpload, setShowUpload]     = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");

  const filtered = files.filter((f) => {
    const catOk    = activeCategory === "Semua" || f.category === activeCategory;
    const searchOk = f.name.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  const handleUpload = (file: ArsipFile) => setFiles((p) => [file, ...p]);
  const handleDelete = (id: string) => { setFiles((p) => p.filter((f) => f.id !== id)); setDeleteId(null); };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Arsip Digital</h1>
          <p className="text-slate-500 text-sm mt-1">{files.length} dokumen tersimpan</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.filter((c) => c !== "Semua").slice(0, 4).map((cat) => {
          const count = files.filter((f) => f.category === cat).length;
          return (
            <div key={cat} className={cn("p-4 rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.02]", CAT_COLORS[cat])}
              onClick={() => setActiveCategory(cat)}>
              <p className="font-bold text-xl leading-none">{count}</p>
              <p className="text-xs opacity-70 mt-1">{cat}</p>
            </div>
          );
        })}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari file..."
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activeCategory === cat
                  ? cat === "Semua"
                    ? "bg-white/[0.12] text-white border-white/[0.15]"
                    : CAT_COLORS[cat]
                  : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.07]"
              )}
            >
              {cat}
              {cat !== "Semua" && (
                <span className="ml-1.5 opacity-60">
                  {files.filter((f) => f.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl bg-white/[0.05] border border-white/[0.08] p-1 ml-auto">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                viewMode === v ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Files ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Tidak ada file ditemukan</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((file, i) => {
            const FileIcon = FILE_ICONS[file.type] ?? File;
            const colorCls = FILE_COLORS[file.type] ?? "text-slate-400 bg-slate-500/10 border-slate-500/20";
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group p-4 rounded-2xl bg-[#111827] border border-white/[0.07] hover:border-emerald-500/20 transition-all"
              >
                {/* Icon */}
                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center mb-3", colorCls)}>
                  <FileIcon className="w-5 h-5" />
                </div>

                {/* Info */}
                <p className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-snug">{file.name}</p>
                <p className="text-slate-500 text-xs mb-1">{file.size} · {formatDate(file.date)}</p>
                <p className="text-slate-600 text-xs mb-3">oleh {file.uploadedBy}</p>

                {/* Category + Actions */}
                <div className="flex items-center justify-between">
                  <span className={cn("px-2 py-0.5 rounded-lg text-[11px] font-semibold border", CAT_COLORS[file.category])}>
                    {file.category}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg bg-white/[0.07] text-slate-400 hover:text-white transition-all" title="Preview">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/[0.07] text-slate-400 hover:text-white transition-all" title="Download">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(file.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["File", "Kategori", "Ukuran", "Tanggal", "Uploader", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, i) => {
                const FileIcon = FILE_ICONS[file.type] ?? File;
                const colorCls = FILE_COLORS[file.type] ?? "text-slate-400 bg-slate-500/10 border-slate-500/20";
                return (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center shrink-0", colorCls)}>
                          <FileIcon className="w-4 h-4" />
                        </div>
                        <span className="text-white text-sm font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-0.5 rounded-lg text-[11px] font-semibold border", CAT_COLORS[file.category])}>
                        {file.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm">{file.size}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm whitespace-nowrap">{formatDate(file.date)}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm">{file.uploadedBy}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-white/[0.07] text-slate-400 hover:text-white transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-white/[0.07] text-slate-400 hover:text-white transition-all">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(file.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals ── */}
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onUpload={handleUpload} />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus File?" size="sm">
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          File akan dihapus dari arsip. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 text-sm font-semibold transition-all"
          >
            Ya, Hapus
          </button>
          <button onClick={() => setDeleteId(null)} className="btn-ghost py-2.5 px-5 text-sm">
            Batal
          </button>
        </div>
      </Modal>
    </div>
  );
}
