"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, X, Save } from "lucide-react";
import { useTransactions, useCreateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { transactions as seedTx, budgetSummary } from "@/data/finance";
import { Modal } from "@/components/ui/Modal";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportKeuanganPDF, exportKeuanganExcel } from "@/lib/export";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { TransactionRow } from "@/types/database";
import type { TransactionPayload } from "@/hooks/useTransactions";

const MONTHLY = [
  { month: "Mei",    income: 1600000, expense: 3100000 },
  { month: "Jun W1", income: 1400000, expense: 1530000 },
  { month: "Jun W2", income: 1400000, expense: 1400000 },
];

const CATS = ["Iuran", "Iuran Pangan", "Transportasi", "Akomodasi", "Konsumsi", "ATK", "Perlengkapan", "Lainnya"];

const EMPTY: TransactionPayload = {
  type: "expense", description: "", amount: 0,
  date: new Date().toISOString().split("T")[0], category: "Lainnya", created_by: "Admin",
};

function TxForm({ open, onClose, onSave, saving }: {
  open: boolean; onClose: () => void; onSave: (d: TransactionPayload) => void; saving: boolean;
}) {
  const [form, setForm] = useState<TransactionPayload>(EMPTY);
  const set = (k: keyof TransactionPayload, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Tambah Transaksi" size="md">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <div>
          <label className="label">Tipe Transaksi</label>
          <div className="flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-border)" }}>
            {(["income", "expense"] as const).map((t) => (
              <button key={t} type="button" onClick={() => set("type", t)}
                className={cn("flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
                  form.type === t ? (t === "income" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400") : "hover:text-white"
                )}
                style={{ color: form.type === t ? undefined : "var(--c-text-2)" }}>
                {t === "income" ? "Pemasukan" : "Pengeluaran"}
              </button>
            ))}
          </div>
        </div>
        <div><label className="label">Deskripsi *</label>
          <input value={form.description} onChange={(e) => set("description", e.target.value)} required placeholder="Keterangan transaksi" className="input" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Jumlah (Rp) *</label>
            <input type="number" value={form.amount || ""} onChange={(e) => set("amount", parseInt(e.target.value) || 0)} required min={1} placeholder="0" className="input" /></div>
          <div><label className="label">Tanggal *</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Kategori</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div><label className="label">Dicatat oleh</label>
            <input value={form.created_by} onChange={(e) => set("created_by", e.target.value)} placeholder="Nama" className="input" /></div>
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

export default function KeuanganPage() {
  const { data: dbTx, isLoading } = useTransactions();
  const createTx = useCreateTransaction();
  const deleteTx = useDeleteTransaction();

  const [showForm, setShow] = useState(false);
  const [deleteId, setDel]  = useState<string | null>(null);

  const all = (dbTx ?? seedTx) as unknown as TransactionRow[];
  const income  = all.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = all.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const summaries = [
    { label: "Total Pemasukan",   value: income,   icon: TrendingUp,   accent: "#10b981" },
    { label: "Total Pengeluaran", value: expense,  icon: TrendingDown, accent: "#ef4444" },
    { label: "Saldo Tersisa",     value: balance,  icon: Wallet,       accent: "#06b6d4" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Keuangan</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--c-text-2)" }}>Laporan keuangan KKN 146 Desa Talang Marap</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <ExportButton options={[
            { label: "Export PDF",   format: "pdf",   onClick: () => exportKeuanganPDF(all) },
            { label: "Export Excel", format: "excel", onClick: () => exportKeuanganExcel(all) },
          ]} />
          <button onClick={() => setShow(true)} className="btn btn-primary"><Plus className="w-4 h-4" />Tambah</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaries.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card" style={{ padding: "24px", background: `${s.accent}0d`, border: `1px solid ${s.accent}25` }}>
            <s.icon className="w-5 h-5 mb-3" style={{ color: s.accent }} />
            <p className="text-white font-bold text-2xl leading-none mb-1.5">{formatCurrency(s.value)}</p>
            <p className="text-sm font-medium" style={{ color: s.accent }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card" style={{ padding: "24px" }}>
          <h3 className="text-white font-semibold text-sm mb-5">Distribusi Pengeluaran</h3>
          <div className="flex items-center gap-5">
            <div className="shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={budgetSummary.categories} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="amount" strokeWidth={0}>
                    {budgetSummary.categories.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5 min-w-0">
              {budgetSummary.categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs truncate" style={{ color: "var(--c-text-2)" }}>{cat.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white shrink-0">{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: "24px" }}>
          <h3 className="text-white font-semibold text-sm mb-5">Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={MONTHLY} barSize={14} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#4a5878", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a5878", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip contentStyle={{ background: "#0e1628", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ color: "#8b9ab8", fontSize: "12px", paddingTop: "8px" }} />
              <Bar dataKey="income"  fill="#10b981" radius={[4, 4, 0, 0]} name="Pemasukan" />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--c-border)" }}>
          <h3 className="text-white font-semibold text-sm">Riwayat Transaksi</h3>
          <span className="text-xs" style={{ color: "var(--c-text-3)" }}>{all.length} transaksi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                {["Deskripsi", "Tanggal", "Kategori", "Tipe", "Jumlah", ""].map((h, i) => (
                  <th key={i} className={cn("px-5 py-3.5 text-xs font-semibold uppercase tracking-wider", h === "Jumlah" ? "text-right" : "text-left")}
                    style={{ color: "var(--c-text-3)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse" style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {[200, 100, 80, 80, 100, 30].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 rounded" style={{ width: w, background: "rgba(255,255,255,0.06)" }} /></td>
                    ))}
                  </tr>
                ))
                : all.map((tx, i) => (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="tbl-row">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: tx.type === "income" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                          {tx.type === "income" ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
                        </div>
                        <span className="font-medium text-white">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "var(--c-text-2)" }}>{formatDate(tx.date)}</td>
                    <td className="px-5 py-3.5"><span className="badge badge-slate">{tx.category}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={cn("badge", tx.type === "income" ? "badge-green" : "badge-red")}>
                        {tx.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className={cn("px-5 py-3.5 text-right font-bold", tx.type === "income" ? "text-emerald-400" : "text-red-400")}>
                      {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setDel(tx.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10 hover:text-red-400"
                        style={{ color: "var(--c-text-3)" }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TxForm open={showForm} onClose={() => setShow(false)} onSave={async (d) => { await createTx.mutateAsync(d); setShow(false); }} saving={createTx.isPending} />
      <Modal open={!!deleteId} onClose={() => setDel(null)} title="Hapus Transaksi?" size="sm">
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--c-text-2)" }}>Data transaksi akan dihapus permanen.</p>
        <div className="flex gap-3">
          <button onClick={async () => { if (deleteId) { await deleteTx.mutateAsync(deleteId); setDel(null); } }} disabled={deleteTx.isPending} className="btn btn-danger flex-1 disabled:opacity-60">
            {deleteTx.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDel(null)} className="btn btn-ghost px-5">Batal</button>
        </div>
      </Modal>
    </div>
  );
}
