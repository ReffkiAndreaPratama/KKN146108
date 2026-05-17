"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download, FileText, FileSpreadsheet,
  Users, Rocket, DollarSign, Package,
  ClipboardList, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useProker } from "@/hooks/useProker";
import { useTransactions } from "@/hooks/useTransactions";
import { members as seedMembers } from "@/data/members";
import { prokerList as seedProker } from "@/data/proker";
import { transactions as seedTx } from "@/data/finance";
import { inventoryItems } from "@/data/inventory";
import {
  exportAnggotaPDF, exportAnggotaExcel,
  exportProkerPDF,  exportProkerExcel,
  exportKeuanganPDF, exportKeuanganExcel,
  exportInventarisPDF, exportInventarisExcel,
  exportAbsensiPDF, exportAbsensiExcel,
} from "@/lib/export";
import { cn } from "@/lib/utils";
import type { MemberRow, ProkerRow, TransactionRow } from "@/types/database";

/* ─── types ───────────────────────────────────────────────── */
type ExportStatus = "idle" | "loading" | "done" | "error";

interface ExportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  exports: {
    label: string;
    format: "pdf" | "excel";
    fn: () => Promise<void>;
  }[];
}

/* ─── single export item ──────────────────────────────────── */
function ExportItem({
  label,
  format,
  fn,
}: {
  label: string;
  format: "pdf" | "excel";
  fn: () => Promise<void>;
}) {
  const [status, setStatus] = useState<ExportStatus>("idle");

  const handle = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      await fn();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const isPDF   = format === "pdf";
  const Icon    = isPDF ? FileText : FileSpreadsheet;
  const iconCls = isPDF ? "text-red-400" : "text-emerald-400";
  const bgCls   = isPDF ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/15" : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15";

  return (
    <button
      onClick={handle}
      disabled={status === "loading"}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all text-left disabled:opacity-60",
        bgCls
      )}
    >
      {status === "loading" ? (
        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
      ) : status === "done" ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : status === "error" ? (
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
      ) : (
        <Icon className={cn("w-4 h-4 shrink-0", iconCls)} />
      )}
      <div className="min-w-0">
        <p className="text-white text-sm font-medium leading-tight">
          {status === "loading" ? "Mengekspor..." : status === "done" ? "Berhasil diunduh!" : status === "error" ? "Gagal, coba lagi" : label}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          {format === "pdf" ? "Adobe PDF (.pdf)" : "Microsoft Excel (.xlsx)"}
        </p>
      </div>
      {status === "idle" && (
        <Download className="w-3.5 h-3.5 text-slate-500 ml-auto shrink-0" />
      )}
    </button>
  );
}

/* ─── export card ─────────────────────────────────────────── */
function ExportCard({ card, index }: { card: ExportCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07] flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0", card.color)}>
          <card.icon className={cn("w-5 h-5", card.iconColor)} />
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-bold text-base leading-tight">{card.title}</h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">{card.description}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Export options */}
      <div className="space-y-2.5">
        {card.exports.map((exp) => (
          <ExportItem key={exp.label} label={exp.label} format={exp.format} fn={exp.fn} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── page ────────────────────────────────────────────────── */
export default function ExportPage() {
  const { data: dbMembers }  = useMembers();
  const { data: dbProker }   = useProker();
  const { data: dbTx }       = useTransactions();

  const members      = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const proker       = (dbProker  ?? seedProker)  as unknown as ProkerRow[];
  const transactions = (dbTx      ?? seedTx)      as unknown as TransactionRow[];

  // Dummy absensi data (today, all hadir)
  const absensiData = members.map((m) => ({
    name: m.name,
    date: new Date().toISOString().split("T")[0],
    status: "hadir",
    note: null,
  }));

  const cards: ExportCard[] = [
    {
      id: "anggota",
      title: "Data Anggota",
      description: `${members.length} anggota KKN 146 dari berbagai fakultas Universitas Bengkulu.`,
      icon: Users,
      color: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      exports: [
        { label: "Export Daftar Anggota (PDF)",   format: "pdf",   fn: () => exportAnggotaPDF(members) },
        { label: "Export Daftar Anggota (Excel)", format: "excel", fn: () => exportAnggotaExcel(members) },
      ],
    },
    {
      id: "proker",
      title: "Program Kerja",
      description: `${proker.length} program kerja lintas bidang dengan rata-rata progress ${proker.length ? Math.round(proker.reduce((a, p) => a + p.progress, 0) / proker.length) : 0}%.`,
      icon: Rocket,
      color: "bg-violet-500/10 border-violet-500/20",
      iconColor: "text-violet-400",
      exports: [
        { label: "Laporan Program Kerja (PDF)",   format: "pdf",   fn: () => exportProkerPDF(proker) },
        { label: "Laporan Program Kerja (Excel)", format: "excel", fn: () => exportProkerExcel(proker) },
      ],
    },
    {
      id: "keuangan",
      title: "Laporan Keuangan",
      description: `${transactions.length} transaksi keuangan KKN 146 dengan ringkasan pemasukan, pengeluaran, dan saldo.`,
      icon: DollarSign,
      color: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400",
      exports: [
        { label: "Laporan Keuangan (PDF)",   format: "pdf",   fn: () => exportKeuanganPDF(transactions) },
        { label: "Laporan Keuangan (Excel)", format: "excel", fn: () => exportKeuanganExcel(transactions) },
      ],
    },
    {
      id: "inventaris",
      title: "Inventaris & Perlengkapan",
      description: `${inventoryItems.length} item perlengkapan KKN 146 dengan status ketersediaan dan checklist.`,
      icon: Package,
      color: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
      exports: [
        { label: "Daftar Inventaris (PDF)",   format: "pdf",   fn: () => exportInventarisPDF(inventoryItems) },
        { label: "Daftar Inventaris (Excel)", format: "excel", fn: () => exportInventarisExcel(inventoryItems) },
      ],
    },
    {
      id: "absensi",
      title: "Rekap Absensi",
      description: `Rekap kehadiran ${members.length} anggota KKN 146 per tanggal.`,
      icon: ClipboardList,
      color: "bg-pink-500/10 border-pink-500/20",
      iconColor: "text-pink-400",
      exports: [
        { label: "Rekap Absensi (PDF)",   format: "pdf",   fn: () => exportAbsensiPDF(absensiData) },
        { label: "Rekap Absensi (Excel)", format: "excel", fn: () => exportAbsensiExcel(absensiData) },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Export Laporan</h1>
        <p className="text-slate-500 text-sm mt-1">
          Unduh semua laporan KKN 146 dalam format PDF atau Excel
        </p>
      </motion.div>

      {/* ── Info banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/20"
      >
        <Download className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-semibold text-sm">Semua laporan siap diunduh</p>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            File akan otomatis terunduh ke folder Downloads. PDF menggunakan desain profesional
            dengan header KKN 146. Excel dapat diedit dan dicetak langsung.
          </p>
        </div>
      </motion.div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card, i) => (
          <ExportCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── Quick export all ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07]"
      >
        <h3 className="text-white font-bold text-base mb-1">Export Semua Sekaligus</h3>
        <p className="text-slate-400 text-xs mb-5 leading-relaxed">
          Unduh semua laporan dalam satu klik. File akan diunduh satu per satu secara berurutan.
        </p>
        <QuickExportAll
          members={members}
          proker={proker}
          transactions={transactions}
        />
      </motion.div>
    </div>
  );
}

/* ─── Quick export all ────────────────────────────────────── */
function QuickExportAll({
  members, proker, transactions,
}: {
  members: MemberRow[];
  proker: ProkerRow[];
  transactions: TransactionRow[];
}) {
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [current, setCurrent] = useState("");
  const [progress, setProgress] = useState(0);

  const absensiData = members.map((m) => ({
    name: m.name,
    date: new Date().toISOString().split("T")[0],
    status: "hadir",
    note: null,
  }));

  const tasks = [
    { label: "Daftar Anggota",    fn: () => exportAnggotaPDF(members) },
    { label: "Program Kerja",     fn: () => exportProkerPDF(proker) },
    { label: "Laporan Keuangan",  fn: () => exportKeuanganPDF(transactions) },
    { label: "Inventaris",        fn: () => exportInventarisPDF(inventoryItems) },
    { label: "Rekap Absensi",     fn: () => exportAbsensiPDF(absensiData) },
  ];

  const handleAll = async () => {
    if (status === "running") return;
    setStatus("running");
    setProgress(0);

    for (let i = 0; i < tasks.length; i++) {
      setCurrent(tasks[i].label);
      try {
        await tasks[i].fn();
        // small delay between downloads
        await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        console.error(e);
      }
      setProgress(i + 1);
    }

    setCurrent("");
    setStatus("done");
    setTimeout(() => { setStatus("idle"); setProgress(0); }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {status === "running" && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Mengekspor: <span className="text-white font-medium">{current}</span></span>
            <span className="text-emerald-400 font-bold">{progress}/{tasks.length}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              animate={{ width: `${(progress / tasks.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAll}
          disabled={status === "running"}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60",
            status === "done"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "btn-primary"
          )}
        >
          {status === "running" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Mengekspor {progress}/{tasks.length}...
            </>
          ) : status === "done" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Semua Berhasil Diunduh!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Semua PDF
            </>
          )}
        </button>

        <p className="text-slate-500 text-xs self-center">
          {tasks.length} file PDF akan diunduh
        </p>
      </div>
    </div>
  );
}
