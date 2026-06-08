"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, CheckCircle2, Users } from "lucide-react";
import { usePiket } from "@/hooks/usePiket";
import { addDays, format, startOfWeek } from "date-fns";
import { id as localeId } from "date-fns/locale";

const DAYS_ID = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

export default function PiketSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const { data: piketData = [] } = usePiket();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return format(d, "yyyy-MM-dd");
  });

  const piketMap = Object.fromEntries(piketData.map((p) => [p.date, p]));

  return (
    <section id="piket" className="py-24 sm:py-32" style={{ background:"#0b1121" }} ref={ref}>
      <div className="wrapper">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            <Calendar className="w-3.5 h-3.5" /> Jadwal Piket
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Piket Minggu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Ini</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:480, margin:"0 auto" }}>
            {format(weekStart, "d MMMM", { locale: localeId })} — {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: localeId })}
          </p>
        </motion.div>

        {/* Grid 7 hari */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:12 }} className="max-lg:!grid-cols-4 max-sm:!grid-cols-2">
          {weekDays.map((dateStr, i) => {
            const entry = piketMap[dateStr];
            const isToday = dateStr === todayStr;
            const isDone = entry?.completed ?? false;
            const dayLabel = DAYS_ID[i];
            const dateLabel = format(addDays(weekStart, i), "d MMM", { locale: localeId });

            return (
              <motion.div key={dateStr}
                initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay: i * 0.05 }}
                style={{
                  background: isToday ? "rgba(16,185,129,0.06)" : "#111b2e",
                  border: `1px solid ${isToday ? "rgba(16,185,129,0.3)" : isDone ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 160,
                }}>

                {/* Hari + tanggal */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ color: isToday ? "#34d399" : "#fff", fontWeight:700, fontSize:12 }}>{dayLabel}</p>
                    <p style={{ color:"#64748b", fontSize:11, marginTop:1 }}>{dateLabel}</p>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
                    {isToday && (
                      <span style={{ padding:"2px 7px", borderRadius:99, background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:9, fontWeight:700 }}>Hari Ini</span>
                    )}
                    {isDone && (
                      <CheckCircle2 style={{ width:14, height:14, color:"#34d399" }} />
                    )}
                  </div>
                </div>

                {/* Petugas */}
                {entry && entry.members.length > 0 ? (
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:9, fontWeight:600, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Petugas</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {entry.members.slice(0, 3).map((name) => (
                        <div key={name} style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:18, height:18, borderRadius:5, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:8, fontWeight:700, flexShrink:0 }}>
                            {name[0]}
                          </div>
                          <span style={{ color:"#e2e8f0", fontSize:11, lineHeight:1.2 }}>{name.split(" ")[0]}</span>
                        </div>
                      ))}
                      {entry.members.length > 3 && (
                        <span style={{ color:"#475569", fontSize:10 }}>+{entry.members.length - 3} lainnya</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <p style={{ color:"#334155", fontSize:11, textAlign:"center", fontStyle:"italic" }}>Belum ada<br/>jadwal</p>
                  </div>
                )}

                {/* Tugas singkat */}
                {entry && entry.tasks.length > 0 && (
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:8 }}>
                    <p style={{ color:"#475569", fontSize:10, lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {entry.tasks.slice(0,2).join(" · ")}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info jika tidak ada data */}
        {piketData.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.4 }}
            style={{ textAlign:"center", marginTop:24 }}>
            <p style={{ color:"#334155", fontSize:13 }}>
              Jadwal piket belum diatur. Admin dapat mengatur di{" "}
              <a href="/login" style={{ color:"#34d399", textDecoration:"none" }}>dashboard</a>.
            </p>
          </motion.div>
        )}

        {/* Link ke dashboard */}
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.5 }}
          style={{ textAlign:"center", color:"#475569", fontSize:12, marginTop:32, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Users style={{ width:12, height:12 }} />
          Jadwal diatur oleh admin ·{" "}
          <a href="/login" style={{ color:"#34d399", textDecoration:"none" }}>Masuk ke Dashboard</a>
        </motion.p>
      </div>
    </section>
  );
}
