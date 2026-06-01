"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { addDays, format, startOfWeek } from "date-fns";
import { id } from "date-fns/locale";
import type { MemberRow } from "@/types/database";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const TASKS = ["Masak pagi & malam","Bersih-bersih posko","Cuci piring","Belanja kebutuhan","Jaga posko siang"];

export default function PiketPage() {
  const { data: dbMembers } = useMembers();
  const allMembers = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const [weekOffset, setWeekOffset] = useState(0);
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const schedule = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(weekStart, i),
    members: [allMembers[i % allMembers.length], allMembers[(i + 1) % allMembers.length]].filter(Boolean),
  }));

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Jadwal Piket</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Jadwal piket otomatis KKN 146</p>
      </div>

      {/* Week Nav */}
      <div style={{ ...card, padding:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={() => setWeekOffset(w=>w-1)} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronLeft style={{ width:16, height:16 }} />
        </button>
        <div style={{ textAlign:"center" }}>
          <p style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{format(weekStart, "d MMMM", { locale: id })} — {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: id })}</p>
          {weekOffset === 0 && <p style={{ color:"#34d399", fontSize:11, marginTop:2 }}>Minggu Ini</p>}
        </div>
        <button onClick={() => setWeekOffset(w=>w+1)} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronRight style={{ width:16, height:16 }} />
        </button>
      </div>

      {/* Schedule Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
        {schedule.map((day, i) => {
          const dateStr = format(day.date, "yyyy-MM-dd");
          const isToday = dateStr === todayStr;
          const isDone = doneMap[dateStr] ?? false;
          return (
            <div key={i} style={{ ...card, padding:20, borderColor: isToday ? "rgba(16,185,129,0.3)" : undefined, background: isToday ? "rgba(16,185,129,0.05)" : "#111b2e" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <p style={{ color: isToday ? "#34d399" : "#fff", fontWeight:700, fontSize:13 }}>{format(day.date, "EEEE", { locale: id })}</p>
                  <p style={{ color:"#64748b", fontSize:11, marginTop:2 }}>{format(day.date, "d MMM yyyy", { locale: id })}</p>
                </div>
                {isToday && <span style={{ padding:"2px 8px", borderRadius:99, background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:10, fontWeight:600 }}>Hari Ini</span>}
              </div>
              <p style={{ color:"#64748b", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Petugas</p>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
                {day.members.map((m) => (
                  <div key={m.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:700 }}>
                      {m.name.split(" ")[0][0]}
                    </div>
                    <span style={{ color:"#fff", fontSize:12 }}>{m.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setDoneMap(p => ({...p, [dateStr]: !isDone}))}
                style={{ width:"100%", padding:"8px 0", borderRadius:8, border:"1px solid", cursor:"pointer", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  background: isDone ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                  color: isDone ? "#34d399" : "#64748b",
                  borderColor: isDone ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)" }}>
                <CheckCircle2 style={{ width:12, height:12 }} />{isDone ? "Selesai" : "Tandai Selesai"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tasks Reference */}
      <div style={{ ...card, padding:24 }}>
        <h3 style={{ color:"#fff", fontWeight:600, fontSize:14, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          <Calendar style={{ width:16, height:16, color:"#34d399" }} /> Daftar Tugas Piket
        </h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }} className="max-sm:!grid-cols-1">
          {TASKS.map((task, i) => (
            <div key={task} style={{ display:"flex", alignItems:"center", gap:10, padding:12, borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ width:24, height:24, borderRadius:6, background:"rgba(16,185,129,0.1)", color:"#34d399", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</span>
              <span style={{ color:"#94a3b8", fontSize:12 }}>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
