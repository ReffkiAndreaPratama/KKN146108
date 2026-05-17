"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, CheckCircle2, XCircle, AlertCircle, Clock,
  ChevronLeft, ChevronRight, Download,
} from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportAbsensiPDF, exportAbsensiExcel } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { MemberRow } from "@/types/database";

type AttendanceStatus = "hadir" | "izin" | "sakit" | "alpha";

const STATUS_CFG: Record<AttendanceStatus, {
  label: string; icon: React.ElementType;
  cls: string; activeCls: string; dot: string;
}> = {
  hadir: { label: "Hadir",  icon: CheckCircle2, cls: "text-emerald-400", activeCls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", dot: "bg-emerald-500" },
  izin:  { label: "Izin",   icon: Clock,        cls: "text-amber-400",   activeCls: "bg-amber-500/15 text-amber-400 border-amber-500/25",   dot: "bg-amber-500" },
  sakit: { label: "Sakit",  icon: AlertCircle,  cls: "text-blue-400",    activeCls: "bg-blue-500/15 text-blue-400 border-blue-500/25",     dot: "bg-blue-500" },
  alpha: { label: "Alpha",  icon: XCircle,      cls: "text-red-400",     activeCls: "bg-red-500/15 text-red-400 border-red-500/25",       dot: "bg-red-500" },
};

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function fmtDate(d: string): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

export default function AbsensiPage() {
  const { data: dbMembers } = useMembers();
  const allMembers: MemberRow[] = dbMembers ?? (seedMembers as unknown as MemberRow[]);

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  // attendance state: { [date]: { [memberId]: status } }
  const [records, setRecords] = useState<Record<string, Record<string, AttendanceStatus>>>({});

  const getStatus = (memberId: string): AttendanceStatus =>
    records[date]?.[memberId] ?? "hadir";

  const setStatus = (memberId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [date]: { ...(prev[date] ?? {}), [memberId]: status },
    }));
  };

  const counts = (Object.keys(STATUS_CFG) as AttendanceStatus[]).reduce((acc, s) => {
    acc[s] = allMembers.filter((m) => getStatus(m.id) === s).length;
    return acc;
  }, {} as Record<AttendanceStatus, number>);

  const attendanceData = allMembers.map((m) => ({
    name: m.name,
    date,
    status: getStatus(m.id),
    note: null,
  }));

  const getColor = (m: MemberRow) =>
    (m as unknown as { color?: string }).color ?? "from-emerald-500 to-cyan-500";
  const getInit = (m: MemberRow) =>
    (m as unknown as { initials?: string }).initials ?? m.name[0];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Absensi</h1>
          <p className="text-slate-500 text-sm mt-1">Rekap kehadiran anggota KKN 146</p>
        </div>
        <ExportButton
          options={[
            { label: "Export PDF",   format: "pdf",   onClick: () => exportAbsensiPDF(attendanceData, date) },
            { label: "Export Excel", format: "excel", onClick: () => exportAbsensiExcel(attendanceData) },
          ]}
        />
      </div>

      {/* ── Date Navigator ── */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#111827] border border-white/[0.07]">
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.09] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">{fmtDate(date)}</p>
          {date === today && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hari Ini
            </span>
          )}
        </div>
        <button
          onClick={() => setDate(addDays(date, 1))}
          className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.09] transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-auto py-2 text-sm ml-2"
        />
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(STATUS_CFG) as [AttendanceStatus, typeof STATUS_CFG[AttendanceStatus]][]).map(([key, cfg]) => (
          <div key={key} className={cn("p-4 rounded-2xl border text-center", cfg.activeCls)}>
            <cfg.icon className={cn("w-5 h-5 mx-auto mb-2", cfg.cls)} />
            <p className={cn("font-bold text-2xl leading-none", cfg.cls)}>{counts[key]}</p>
            <p className="text-slate-400 text-xs mt-1.5">{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* ── Attendance List ── */}
      <div className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06]">
          <ClipboardList className="w-4 h-4 text-emerald-400" />
          <h3 className="text-white font-semibold text-sm">Daftar Hadir</h3>
          <span className="ml-auto text-slate-500 text-xs">{allMembers.length} anggota</span>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {allMembers.map((member, i) => {
            const current = getStatus(member.id);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Member info */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0",
                    getColor(member)
                  )}>
                    {getInit(member)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{member.name}</p>
                    <p className="text-slate-500 text-xs">{member.role}</p>
                  </div>
                </div>

                {/* Status buttons */}
                <div className="flex gap-1.5">
                  {(Object.entries(STATUS_CFG) as [AttendanceStatus, typeof STATUS_CFG[AttendanceStatus]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setStatus(member.id, key)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        current === key
                          ? cfg.activeCls
                          : "bg-white/[0.04] text-slate-500 border-white/[0.08] hover:bg-white/[0.07] hover:text-slate-300"
                      )}
                    >
                      <cfg.icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div className="px-6 py-3 border-t border-white/[0.06] flex items-center gap-4 flex-wrap">
          {(Object.entries(STATUS_CFG) as [AttendanceStatus, typeof STATUS_CFG[AttendanceStatus]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              <span className="text-slate-400 text-xs">{cfg.label}: <span className="text-white font-semibold">{counts[key]}</span></span>
            </div>
          ))}
          <span className="ml-auto text-slate-500 text-xs">
            Kehadiran: <span className="text-emerald-400 font-semibold">
              {Math.round((counts.hadir / allMembers.length) * 100)}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
