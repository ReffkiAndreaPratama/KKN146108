"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Plus, CheckCircle2, Clock, AlertCircle, Edit2, Trash2, X, Save } from "lucide-react";
import { useProker, useCreateProker, useUpdateProker, useDeleteProker } from "@/hooks/useProker";
import { prokerList as seedProker } from "@/data/proker";
import { Modal } from "@/components/ui/Modal";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportProkerPDF, exportProkerExcel } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { ProkerRow } from "@/types/database";
import type { ProkerPayload } from "@/hooks/useProker";

const CAT_OPTS = [
  { v: "pendidikan", l: "Pendidikan" }, { v: "sosial", l: "Sosial" },
  { v: "teknologi", l: "Teknologi" },   { v: "lingkungan", l: "Lingkungan" },
  { v: "umkm", l: "UMKM" },            { v: "kesehatan", l: "Kesehatan" },
  { v: "keagamaan", l: "Keagamaan" },  { v: "administrasi", l: "Administrasi" },
];

const CAT_BADGE: Record<string, string> = {
  pendidikan: "badge-blue", sosial: "badge-pink", teknologi: "badge-cyan",
  lingkungan: "badge-green", umkm: "badge-amber", kesehatan: "badge-red",
  keagamaan: "badge-violet", administrasi: "badge-slate",
};

const STATUS_CFG = {
  planning:  { label: "Planning",  icon: AlertCircle,  badge: "badge-amber", accent: "#f59e0b" },
  ongoing:   { label: "Ongoing",   icon: Clock,        badge: "badge-cyan",  accent: "#06b6d4" },
  completed: { label: "Completed", icon: CheckCircle2, badge: "badge-green", accent: "#10b981" },
};

const EMPTY: ProkerPayload = {
  name: "", description: "", category: "pendidikan", ketua_pelaksana: "",
  anggota: [], start_date: "", end_date: "", target: "", progress: 0, status: "planning",
};

function ProkerForm({ open, onClose, initial, onSave, saving }: {
  open: boolean; onClose: () => void;
  initial: ProkerPayload; onSave: (d: ProkerPayload) => void; saving: boolean;
}) {
  const [form, setForm] = useState<ProkerPayload>(initial);
  const set = (k: keyof ProkerPayload, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial.name ? "Edit Program Kerja" : "Tambah Program Kerja"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <div><label className="label">Nama Program Kerja *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Bimbingan Belajar Anak SD" className="input" /></div>
        <div><label className="label">Deskripsi *</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} required rows={3} placeholder="Deskripsi program kerja..." className="input" style={{ resize: "none" }} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Kategori *</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
              {CAT_OPTS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select></div>
          <div><label className="label">Status *</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as ProkerPayload["status"])} className="input">
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Ketua Pelaksana *</label>
            <input value={form.ketua_pelaksana} onChange={(e) => set("ketua_pelaksana", e.target.value)} required placeholder="Nama ketua" className="input" /></div>
          <div><label className="label">Target</label>
            <input value={form.target} onChange={(e) => set("target", e.target.value)} placeholder="30 siswa SD" className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Tanggal Mulai *</label>
            <input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required className="input" /></div>
          <div><label className="label">Tanggal Selesai *</label>
            <input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} required className="input" /></div>
        </div>
        <div>
          <label className="label">Progress: <span className="text-emerald-400 font-bold">{form.progress}%</span></label>
          <input type="range" min={0} max={100} value={form.progress} onChange={(e) => set("progress", parseInt(e.target.value))} className="w-full" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary flex-1 disabled:opacity-60">
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan</>}
          </button>
          <button type="button" onClick={onClose} className="btn btn-ghost px-5"><X className="w-4 h-4" />Batal</button>
        </div>
      </form>
    </Modal>
  );
}

type View = "kanban" | "table";

export default function ProkerPage() {
  const { data: dbProker, isLoading } = useProker();
  const createP = useCreateProker();
  const updateP = useUpdateProker();
  const deleteP = useDeleteProker();

  const [view, setView]       = useState<View>("kanban");
  const [showForm, setShow]   = useState(false);
  const [editTarget, setEdit] = useState<ProkerRow | null>(null);
  const [deleteId, setDel]    = useState<string | null>(null);

  const all = (dbProker ?? seedProker) as unknown as ProkerRow[];
  const counts = { planning: all.filter((p) => p.status === "planning").length, ongoing: all.filter((p) => p.status === "ongoing").length, completed: all.filter((p) => p.status === "completed").length };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Program Kerja</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--c-text-2)" }}>{all.length} program kerja KKN 146</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-border)" }}>
            {(["kanban", "table"] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                  view === v ? "text-emerald-400 bg-emerald-500/15" : "hover:text-white")}
                style={{ color: view === v ? undefined : "var(--c-text-2)" }}>{v}</button>
            ))}
          </div>
          <ExportButton options={[
            { label: "Export PDF",   format: "pdf",   onClick: () => exportProkerPDF(all) },
            { label: "Export Excel", format: "excel", onClick: () => exportProkerExcel(all) },
          ]} />
          <button onClick={() => setShow(true)} className="btn btn-primary"><Plus className="w-4 h-4" />Tambah</button>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["planning", "ongoing", "completed"] as const).map((s) => {
          const cfg = STATUS_CFG[s];
          return (
            <div key={s} className="card flex items-center gap-3" style={{ padding: "16px", background: `${cfg.accent}0d`, border: `1px solid ${cfg.accent}25` }}>
              <cfg.icon className="w-5 h-5 shrink-0" style={{ color: cfg.accent }} />
              <div>
                <p className="font-bold text-xl text-white leading-none">{counts[s]}</p>
                <p className="text-xs mt-0.5" style={{ color: cfg.accent }}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(["planning", "ongoing", "completed"] as const).map((status) => {
            const cfg = STATUS_CFG[status];
            const items = all.filter((p) => p.status === status);
            return (
              <div key={status} className="flex flex-col gap-3">
                <div className={cn("badge flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold", cfg.badge)}
                  style={{ borderRadius: "12px" }}>
                  <cfg.icon className="w-4 h-4" />{cfg.label}
                  <span className="ml-auto text-xs opacity-60 font-normal">{items.length}</span>
                </div>
                {isLoading
                  ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="card animate-pulse space-y-2.5" style={{ padding: "16px" }}>
                      <div className="h-3.5 rounded" style={{ background: "rgba(255,255,255,0.06)", width: "75%" }} />
                      <div className="h-3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                      <div className="h-2 rounded mt-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                  ))
                  : items.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="card card-hover group" style={{ padding: "16px" }}>
                      <span className={cn("badge mb-2.5", CAT_BADGE[p.category] ?? "badge-slate")}>
                        {CAT_OPTS.find((c) => c.v === p.category)?.l ?? p.category}
                      </span>
                      <p className="text-white font-semibold text-sm leading-snug mb-1.5">{p.name}</p>
                      <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--c-text-2)" }}>{p.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span style={{ color: "var(--c-text-3)" }}>{p.ketua_pelaksana}</span>
                        <span className="font-bold text-emerald-400">{p.progress}%</span>
                      </div>
                      <div className="progress-track mb-3">
                        <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--c-text-2)" }}>
                          <Edit2 className="w-3 h-3" />Edit
                        </button>
                        <button onClick={() => setDel(p.id)} className="px-3 py-1.5 rounded-lg text-xs transition-all"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                }
                {!isLoading && items.length === 0 && (
                  <div className="p-6 rounded-xl text-center text-xs" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed var(--c-border)", color: "var(--c-text-3)" }}>
                    Tidak ada proker
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      {view === "table" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                  {["Program Kerja", "Kategori", "Ketua", "Status", "Progress", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--c-text-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {all.map((p, i) => {
                  const cfg = STATUS_CFG[p.status];
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="tbl-row">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-xs mt-0.5 line-clamp-1 max-w-[200px]" style={{ color: "var(--c-text-3)" }}>{p.description}</p>
                      </td>
                      <td className="px-5 py-4"><span className={cn("badge", CAT_BADGE[p.category] ?? "badge-slate")}>{CAT_OPTS.find((c) => c.v === p.category)?.l}</span></td>
                      <td className="px-5 py-4 whitespace-nowrap" style={{ color: "var(--c-text-2)" }}>{p.ketua_pelaksana}</td>
                      <td className="px-5 py-4"><span className={cn("badge flex items-center gap-1 w-fit", cfg.badge)}><cfg.icon className="w-3 h-3" />{cfg.label}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 progress-track"><div className="progress-fill" style={{ width: `${p.progress}%` }} /></div>
                          <span className="text-xs font-bold text-emerald-400">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEdit(p)} className="btn btn-ghost text-xs py-1.5 px-3">Edit</button>
                          <button onClick={() => setDel(p.id)} className="btn btn-danger text-xs py-1.5 px-3">Hapus</button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProkerForm open={showForm} onClose={() => setShow(false)} initial={EMPTY}
        onSave={async (d) => { await createP.mutateAsync(d); setShow(false); }} saving={createP.isPending} />
      {editTarget && (
        <ProkerForm open onClose={() => setEdit(null)}
          initial={{ name: editTarget.name, description: editTarget.description, category: editTarget.category, ketua_pelaksana: editTarget.ketua_pelaksana, anggota: editTarget.anggota, start_date: editTarget.start_date, end_date: editTarget.end_date, target: editTarget.target, progress: editTarget.progress, status: editTarget.status }}
          onSave={async (d) => { await updateP.mutateAsync({ id: editTarget.id, ...d }); setEdit(null); }} saving={updateP.isPending} />
      )}
      <Modal open={!!deleteId} onClose={() => setDel(null)} title="Hapus Program Kerja?" size="sm">
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--c-text-2)" }}>Data program kerja akan dihapus permanen.</p>
        <div className="flex gap-3">
          <button onClick={async () => { if (deleteId) { await deleteP.mutateAsync(deleteId); setDel(null); } }} disabled={deleteP.isPending} className="btn btn-danger flex-1 disabled:opacity-60">
            {deleteP.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDel(null)} className="btn btn-ghost px-5">Batal</button>
        </div>
      </Modal>
    </div>
  );
}
