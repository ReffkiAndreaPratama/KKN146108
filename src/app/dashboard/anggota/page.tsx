"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, GraduationCap, Edit2, Trash2, X, Save } from "lucide-react";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { Modal } from "@/components/ui/Modal";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportAnggotaPDF, exportAnggotaExcel } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { MemberRow } from "@/types/database";
import type { MemberPayload } from "@/hooks/useMembers";

/* ─── helpers ─────────────────────────────────────────────── */
const getColor = (m: MemberRow) => (m as unknown as { color?: string }).color ?? "from-emerald-500 to-cyan-500";
const getInit  = (m: MemberRow) => (m as unknown as { initials?: string }).initials ?? m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* ─── Avatar ──────────────────────────────────────────────── */
function Av({ m, size = "md" }: { m: MemberRow; size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-8 h-8 text-[11px] rounded-lg", md: "w-10 h-10 text-xs rounded-xl", lg: "w-12 h-12 text-sm rounded-2xl" }[size];
  return (
    <div className={cn("bg-gradient-to-br flex items-center justify-center text-white font-bold shrink-0", getColor(m), s)}>
      {getInit(m)}
    </div>
  );
}

/* ─── Division badge ──────────────────────────────────────── */
const DIV_CLS: Record<string, string> = {
  Ketua: "badge-green", Sekretaris: "badge-cyan", Bendahara: "badge-rose",
  Humas: "badge-amber", "Humas & Acara": "badge-orange", Acara: "badge-fuchsia", PDD: "badge-indigo",
};
const DivBadge = ({ d }: { d: string }) => (
  <span className={cn("badge", DIV_CLS[d] ?? "badge-slate")}>{d}</span>
);

/* ─── Form ────────────────────────────────────────────────── */
const DIVS = ["Ketua", "Sekretaris", "Bendahara", "Humas", "Humas & Acara", "Acara", "PDD"];
const COLORS = [
  { v: "from-emerald-500 to-teal-600" }, { v: "from-cyan-500 to-sky-600" },
  { v: "from-indigo-500 to-blue-600" }, { v: "from-violet-500 to-purple-600" },
  { v: "from-pink-500 to-rose-600" },   { v: "from-amber-500 to-orange-600" },
  { v: "from-fuchsia-500 to-pink-600" },{ v: "from-rose-500 to-red-600" },
];
const EMPTY: MemberPayload = {
  name: "", nim: "", division: "PDD", role: "", faculty: "", prodi: "",
  gender: "Laki-Laki", quote: "", instagram: "", whatsapp: null,
  photo_url: null, color: "from-emerald-500 to-teal-600", initials: "",
};

function MemberForm({ open, onClose, initial, onSave, saving }: {
  open: boolean; onClose: () => void;
  initial: MemberPayload; onSave: (d: MemberPayload) => void; saving: boolean;
}) {
  const [form, setForm] = useState<MemberPayload>(initial);
  const set = (k: keyof MemberPayload, v: string | null) =>
    setForm((p) => {
      const n = { ...p, [k]: v };
      if (k === "name" && typeof v === "string")
        n.initials = v.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2);
      return n;
    });

  return (
    <Modal open={open} onClose={onClose} title={initial.nim ? "Edit Anggota" : "Tambah Anggota"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Nama Lengkap *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Nama lengkap" className="input" /></div>
          <div><label className="label">NIM *</label><input value={form.nim} onChange={(e) => set("nim", e.target.value)} required placeholder="G1A023039" className="input font-mono" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Divisi *</label>
            <select value={form.division} onChange={(e) => set("division", e.target.value)} className="input">
              {DIVS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><label className="label">Jabatan *</label><input value={form.role} onChange={(e) => set("role", e.target.value)} required placeholder="Koordinator PDD" className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Fakultas *</label><input value={form.faculty} onChange={(e) => set("faculty", e.target.value)} required placeholder="Fakultas Teknik" className="input" /></div>
          <div><label className="label">Program Studi *</label><input value={form.prodi} onChange={(e) => set("prodi", e.target.value)} required placeholder="Informatika" className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Jenis Kelamin</label>
            <select value={form.gender ?? "Laki-Laki"} onChange={(e) => set("gender", e.target.value)} className="input">
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div><label className="label">Instagram</label><input value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="username" className="input" /></div>
        </div>
        <div><label className="label">Quote</label><input value={form.quote ?? ""} onChange={(e) => set("quote", e.target.value)} placeholder="Kata-kata motivasi..." className="input" /></div>
        <div>
          <label className="label">Warna Avatar</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c.v} type="button" onClick={() => set("color", c.v)}
                className={cn("w-8 h-8 rounded-xl bg-gradient-to-br transition-all", c.v,
                  form.color === c.v ? "ring-2 ring-white ring-offset-2 ring-offset-[#0e1628] scale-110" : "opacity-50 hover:opacity-90"
                )} />
            ))}
          </div>
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

/* ─── Page ────────────────────────────────────────────────── */
export default function AnggotaPage() {
  const { data: dbMembers, isLoading } = useMembers();
  const createM = useCreateMember();
  const updateM = useUpdateMember();
  const deleteM = useDeleteMember();

  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit]   = useState<MemberRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const all = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const filtered = all.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.nim.toLowerCase().includes(search.toLowerCase()) ||
    m.division.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Anggota KKN 146</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--c-text-2)" }}>{all.length} anggota terdaftar</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ExportButton options={[
            { label: "Export PDF",   format: "pdf",   onClick: () => exportAnggotaPDF(all) },
            { label: "Export Excel", format: "excel", onClick: () => exportAnggotaExcel(all) },
          ]} />
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />Tambah
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--c-text-3)" }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, NIM, divisi..." className="input pl-9" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card card-hover flex flex-col gap-4" style={{ padding: "20px" }}>
            {/* Avatar + name */}
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <Av m={m} size="lg" />
                <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center text-white text-[8px] font-bold",
                  m.gender === "Perempuan" ? "bg-pink-500" : "bg-blue-500")}
                  style={{ borderColor: "var(--c-card)" }}>
                  {m.gender === "Perempuan" ? "♀" : "♂"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[13px] leading-snug line-clamp-2">{m.name}</p>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--c-text-3)" }}>{m.nim}</p>
              </div>
            </div>

            <DivBadge d={m.division} />

            <div className="flex items-start gap-2">
              <GraduationCap className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--c-text-3)" }} />
              <div className="min-w-0">
                <p className="text-xs line-clamp-1" style={{ color: "var(--c-text-2)" }}>{m.faculty}</p>
                <p className="text-xs font-medium mt-0.5 text-white">{m.prodi}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 mt-auto" style={{ borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setEdit(m)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--c-text-2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--c-text-2)"; }}>
                <Edit2 className="w-3 h-3" />Edit
              </button>
              <button onClick={() => setDeleteId(m.id)}
                className="flex items-center justify-center px-3 py-2 rounded-xl transition-all"
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="flex items-center gap-2.5 px-6 py-4" style={{ borderBottom: "1px solid var(--c-border)" }}>
          <Users className="w-4 h-4 text-emerald-400" />
          <p className="text-[13px] font-semibold text-white">Tabel Anggota</p>
          <span className="ml-auto text-xs" style={{ color: "var(--c-text-3)" }}>{filtered.length} anggota</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                {["No", "Nama", "NIM", "Fakultas", "Prodi", "Divisi", "JK"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--c-text-3)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse" style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {[8, 160, 80, 140, 100, 60, 20].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 rounded" style={{ width: w, background: "rgba(255,255,255,0.06)" }} /></td>
                    ))}
                  </tr>
                ))
                : filtered.map((m, i) => (
                  <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="tbl-row">
                    <td className="px-5 py-3.5" style={{ color: "var(--c-text-3)" }}>{i + 1}.</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Av m={m} size="sm" />
                        <span className="font-medium text-white">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono whitespace-nowrap" style={{ color: "var(--c-text-2)" }}>{m.nim}</td>
                    <td className="px-5 py-3.5 max-w-[180px]" style={{ color: "var(--c-text-2)" }}><span className="line-clamp-1">{m.faculty}</span></td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-white">{m.prodi}</td>
                    <td className="px-5 py-3.5"><DivBadge d={m.division} /></td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold",
                        m.gender === "Perempuan" ? "bg-pink-500/20 text-pink-400" : "bg-blue-500/20 text-blue-400")}>
                        {m.gender === "Perempuan" ? "♀" : "♂"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <MemberForm open={showForm} onClose={() => setShowForm(false)} initial={EMPTY}
        onSave={async (d) => { await createM.mutateAsync(d); setShowForm(false); }} saving={createM.isPending} />
      {editTarget && (
        <MemberForm open onClose={() => setEdit(null)}
          initial={{ name: editTarget.name, nim: editTarget.nim, division: editTarget.division, role: editTarget.role, faculty: editTarget.faculty, prodi: editTarget.prodi, gender: editTarget.gender, quote: editTarget.quote ?? "", instagram: editTarget.instagram ?? "", whatsapp: editTarget.whatsapp ?? null, photo_url: editTarget.photo_url ?? null, color: editTarget.color, initials: editTarget.initials }}
          onSave={async (d) => { await updateM.mutateAsync({ id: editTarget.id, ...d }); setEdit(null); }} saving={updateM.isPending} />
      )}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Anggota?" size="sm">
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--c-text-2)" }}>Data anggota akan dihapus permanen dari database.</p>
        <div className="flex gap-3">
          <button onClick={async () => { if (deleteId) { await deleteM.mutateAsync(deleteId); setDeleteId(null); } }}
            disabled={deleteM.isPending} className="btn btn-danger flex-1 disabled:opacity-60">
            {deleteM.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} className="btn btn-ghost px-5">Batal</button>
        </div>
      </Modal>
    </div>
  );
}
