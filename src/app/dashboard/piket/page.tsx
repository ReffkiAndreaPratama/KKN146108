"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { cn } from "@/lib/utils";
import { addDays, format, startOfWeek } from "date-fns";
import { id } from "date-fns/locale";
import type { MemberRow } from "@/types/database";

const PIKET_TASKS = [
  "Masak pagi & malam",
  "Bersih-bersih posko",
  "Cuci piring",
  "Belanja kebutuhan",
  "Jaga posko siang",
];

function generateSchedule(startDate: Date, members: MemberRow[]) {
  if (!members.length) return [];
  return Array.from({ length: 7 }, (_, i) => ({
    date: addDays(startDate, i),
    members: [
      members[i % members.length],
      members[(i + 1) % members.length],
    ],
    completed: i < 2,
  }));
}

export default function PiketPage() {
  const { data: dbMembers } = useMembers();
  const allMembers: MemberRow[] = dbMembers ?? (seedMembers as unknown as MemberRow[]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [doneMap, setDoneMap]       = useState<Record<string, boolean>>({});

  const weekStart = startOfWeek(
    addDays(new Date(), weekOffset * 7),
    { weekStartsOn: 1 }
  );
  const schedule = generateSchedule(weekStart, allMembers);
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const toggleDone = (dateStr: string) =>
    setDoneMap((p) => ({ ...p, [dateStr]: !p[dateStr] }));

  const getColor = (m: MemberRow) =>
    (m as unknown as { color?: string }).color ?? "from-emerald-500 to-cyan-500";
  const getInit = (m: MemberRow) =>
    (m as unknown as { initials?: string }).initials ?? m.name.split(" ")[0][0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Jadwal Piket</h1>
          <p className="text-slate-500 text-sm mt-1">Jadwal piket otomatis KKN 146</p>
        </div>
        <button
          onClick={() => setWeekOffset(0)}
          className="btn-ghost self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Minggu Ini
        </button>
      </div>

      {/* ── Week Navigator ── */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111827] border border-white/[0.07]">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.09] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">
            {format(weekStart, "d MMMM", { locale: id })} —{" "}
            {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: id })}
          </p>
          {weekOffset === 0 && (
            <span className="text-emerald-400 text-xs">Minggu Ini</span>
          )}
          {weekOffset !== 0 && (
            <span className="text-slate-500 text-xs">
              {weekOffset > 0 ? `+${weekOffset}` : weekOffset} minggu
            </span>
          )}
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.09] transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Schedule Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.map((day, i) => {
          const dateStr  = format(day.date, "yyyy-MM-dd");
          const isToday  = dateStr === todayStr;
          const isDone   = doneMap[dateStr] ?? day.completed;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "p-5 rounded-2xl border transition-all",
                isToday
                  ? "bg-emerald-500/[0.07] border-emerald-500/25"
                  : isDone
                  ? "bg-white/[0.02] border-white/[0.05] opacity-70"
                  : "bg-[#111827] border-white/[0.07]"
              )}
            >
              {/* Date header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={cn("font-bold text-sm", isToday ? "text-emerald-400" : "text-white")}>
                    {format(day.date, "EEEE", { locale: id })}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {format(day.date, "d MMM yyyy", { locale: id })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      Hari Ini
                    </span>
                  )}
                  <button
                    onClick={() => toggleDone(dateStr)}
                    className={cn(
                      "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                      isDone
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-white/[0.15] hover:border-emerald-500/50"
                    )}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </div>

              {/* Petugas */}
              <div className="mb-4">
                <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
                  Petugas
                </p>
                <div className="space-y-2">
                  {day.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                        getColor(member)
                      )}>
                        {getInit(member)}
                      </div>
                      <span className="text-white text-xs font-medium truncate">
                        {member.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
                  Tugas
                </p>
                <div className="space-y-1.5">
                  {PIKET_TASKS.slice(0, 3).map((task) => (
                    <div key={task} className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isDone ? "bg-emerald-400" : "bg-slate-600"
                      )} />
                      <span className={cn(
                        "text-[11px]",
                        isDone ? "text-slate-500 line-through" : "text-slate-400"
                      )}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Task Reference ── */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.07]">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Daftar Tugas Piket Lengkap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PIKET_TASKS.map((task, i) => (
            <div key={task} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-slate-300 text-sm">{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rotation Info ── */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-slate-400 text-sm leading-relaxed">
          <span className="text-white font-semibold">Sistem Rotasi Otomatis</span> — Jadwal piket dirotasi setiap hari
          berdasarkan urutan anggota. Setiap hari ada{" "}
          <span className="text-emerald-400 font-semibold">2 petugas</span> yang bertugas.
          Klik checkbox untuk menandai hari sebagai selesai.
        </p>
      </div>
    </div>
  );
}
