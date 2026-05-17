"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Plus, Tag, Calendar, Trash2, X, Save,
  Search, Filter,
} from "lucide-react";
import { useJournal, useCreateJournal, useDeleteJournal } from "@/hooks/useJournal";
import { Modal } from "@/components/ui/Modal";
import { cn, formatDate } from "@/lib/utils";
import type { JournalRow } from "@/types/database";
import type { JournalPayload } from "@/hooks/useJournal";

type Priority = "low" | "medium" | "high";

const PRIORITY_CFG: Record<Priority, { label: string; cls: string }> = {
  low:    { label: "Rendah", cls: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  medium: { label: "Sedang", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  high:   { label: "Tinggi", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
};

const SEED_ENTRIES: JournalRow[] = [
  { id: "1", date: "2026-06-07", title: "Gotong Royong Perdana",       content: "Hari ini kami melaksanakan gotong royong bersama warga desa. Antusias warga sangat tinggi. Berhasil membersihkan area sekitar balai desa dan jalan utama desa.",                                    priority: "high",   tags: ["gotong royong", "lingkungan", "warga"], author: "Ping",    created_at: "" },
  { id: "2", date: "2026-06-06", title: "Rapat Koordinasi Proker",     content: "Rapat membahas progress program kerja minggu pertama. Semua proker berjalan sesuai rencana. Perlu persiapan lebih untuk sosialisasi kesehatan minggu depan.",                                          priority: "medium", tags: ["rapat", "koordinasi", "proker"],        author: "Revina",  created_at: "" },
  { id: "3", date: "2026-06-05", title: "Kunjungan ke Sekolah SD",     content: "Survei ke SDN Talang Marap untuk persiapan program bimbel. Kepala sekolah sangat mendukung dan antusias. Program bimbel akan dimulai minggu depan setiap Senin-Rabu.",                                  priority: "medium", tags: ["pendidikan", "survei", "bimbel"],       author: "Hafizah", created_at: "" },
  { id: "4", date: "2026-06-04", title: "Persiapan Spanduk & Atribut", content: "Spanduk KKN sudah terpasang di posko dan balai desa. Atribut tim sudah lengkap. Semua anggota sudah menerima kaos KKN 146.",                                                                           priority: "low",    tags: ["persiapan", "atribut"],                 author: "Reffki",  created_at: "" },
  { id: "5", date: "2026-06-03", title: "Perkenalan dengan Warga",     content: "Hari pertama di desa. Melakukan perkenalan dengan perangkat desa dan warga sekitar posko. Sambutan warga sangat hangat dan ramah. Posko sudah bersih dan siap ditempati.",                              priority: "medium", tags: ["perkenalan", "warga", "posko"],         author: "Ping",    created_at: "" },
];

const EMPTY: JournalPayload = {
  date: new Date().toISOString().split("T")[0],
  title: "", content: "", priority: "medium", tags: [], author: "",
};

export default function JurnalPage() {
  const { data: dbEntries, isLoading } = useJournal();
  const createJournal = useCreateJournal();
  const deleteJournal = useDeleteJournal();

  const entries: JournalRow[] = dbEntries ?? SEED_ENTRIES;

  const [showForm, setShowForm]     = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [form, setForm]             = useState<JournalPayload>(EMPTY);
  const [tagsInput, setTagsInput]   = useState("");

  const filtered = entries.filter((e) => {
    const searchOk   = e.title.toLowerCase().includes(search.toLowerCase()) ||
                       e.content.toLowerCase().includes(search.toLowerCase());
    const priorityOk = filterPriority === "all" || e.priority === filterPriority;
    return searchOk && priorityOk;
  });

  const set = (k: keyof JournalPayload, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJournal.mutateAsync({
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setForm(EMPTY);
    setTagsInput("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Jurnal Harian</h1>
          <p className="text-slate-500 text-sm mt-1">{entries.length} catatan kegiatan</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Tambah Catatan
        </button>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari catatan..."
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {(["all", "high", "medium", "low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                filterPriority === p
                  ? p === "all"
                    ? "bg-white/[0.12] text-white border-white/[0.15]"
                    : PRIORITY_CFG[p as Priority].cls
                  : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.07]"
              )}
            >
              {p === "all" ? "Semua" : PRIORITY_CFG[p as Priority].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Add Form Modal ── */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Catatan Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Tanggal *</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className="input" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Prioritas</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="input">
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Judul *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Judul catatan..." className="input" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Isi Catatan *</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              required rows={5}
              placeholder="Ceritakan kegiatan hari ini..."
              className="input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Penulis</label>
              <input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Nama anggota" className="input" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Tags (pisah koma)</label>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="rapat, kegiatan" className="input" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createJournal.isPending} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
              {createJournal.isPending
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</span>
                : <><Save className="w-4 h-4" />Simpan</>
              }
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost py-3 px-5">
              <X className="w-4 h-4" />Batal
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Entries ── */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07] animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-white/[0.06] rounded-full w-1/2" />
                <div className="h-5 w-16 bg-white/[0.06] rounded-full" />
              </div>
              <div className="h-3 bg-white/[0.04] rounded-full" />
              <div className="h-3 bg-white/[0.04] rounded-full w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Tidak ada catatan ditemukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry, i) => {
            const priority = PRIORITY_CFG[entry.priority];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07] hover:border-white/[0.12] transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-white font-bold text-base leading-snug">{entry.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border", priority.cls)}>
                      {priority.label}
                    </span>
                    <button
                      onClick={() => setDeleteId(entry.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{entry.content}</p>

                {/* Footer */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.06] text-slate-400 text-xs">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.date)}
                    </span>
                    {entry.author && <span>· {entry.author}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Delete Confirm ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Catatan?" size="sm">
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Catatan ini akan dihapus permanen dan tidak dapat dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (deleteId) { await deleteJournal.mutateAsync(deleteId); setDeleteId(null); }
            }}
            disabled={deleteJournal.isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 text-sm font-semibold transition-all disabled:opacity-60"
          >
            {deleteJournal.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} className="btn-ghost py-2.5 px-5 text-sm">
            Batal
          </button>
        </div>
      </Modal>
    </div>
  );
}
