"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, CheckCircle2, Clock, Circle, MapPin, BookOpen, Car, Users, Rocket, BarChart2, Award, Home } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { formatDate } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = { MapPin, BookOpen, Car, Users, Rocket, BarChart: BarChart2, Award, Home, Calendar };

const S = {
  completed: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", Icon: CheckCircle2, label: "Selesai" },
  ongoing: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", Icon: Clock, label: "Berlangsung" },
  upcoming: { bg: "bg-white/[0.04]", border: "border-white/[0.08]", text: "text-slate-400", Icon: Circle, label: "Akan Datang" },
};

export default function TimelineSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="timeline" className="py-24 sm:py-32" style={{ background:"#0b1121" }} ref={ref}>
      <div className="wrapper">
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} style={{ textAlign:"center", marginBottom:48 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            <Calendar className="w-3.5 h-3.5" /> Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Perjalanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">KKN 146</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", textAlign:"center" }}>Rangkaian kegiatan dari awal persiapan hingga penutupan KKN 146.</p>
        </motion.div>

        <div style={{ maxWidth:720, marginLeft:"auto", marginRight:"auto", position:"relative" }}>
          {/* Garis vertikal */}
          <div style={{ position:"absolute", left:22, top:24, bottom:24, width:2, background:"linear-gradient(to bottom, #10b981, rgba(6,182,212,0.5), rgba(255,255,255,0.05))", borderRadius:2 }} />

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {timelineEvents.map((ev, i) => {
            const cfg = S[ev.status];
            const EvIcon = ICONS[ev.icon ?? ""] ?? Calendar;
            return (
              <motion.div key={ev.id} initial={{ opacity:0, x:-12 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:i*.06 }}
                style={{ display:"flex", gap:20, alignItems:"flex-start" }}>

                {/* Icon circle — di atas garis */}
                <div style={{
                  width:44, height:44, borderRadius:"50%", flexShrink:0, zIndex:1,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: ev.status === "completed" ? "rgba(16,185,129,0.15)" : ev.status === "ongoing" ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${ev.status === "completed" ? "rgba(16,185,129,0.4)" : ev.status === "ongoing" ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}>
                  <EvIcon style={{ width:18, height:18 }} className={cfg.text} />
                </div>

                {/* Card */}
                <div style={{
                  flex:1,
                  padding:"18px 22px",
                  borderRadius:16,
                  border:`1px solid ${ev.status === "completed" ? "rgba(16,185,129,0.15)" : ev.status === "ongoing" ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.06)"}`,
                  background: ev.status === "completed" ? "rgba(16,185,129,0.04)" : ev.status === "ongoing" ? "rgba(6,182,212,0.05)" : "#111b2e",
                  marginBottom: i < timelineEvents.length - 1 ? 4 : 0,
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8 }}>
                    <h3 style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{ev.title}</h3>
                    <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, flexShrink:0 }} className={cfg.text}>
                      <cfg.Icon style={{ width:12, height:12 }} />{cfg.label}
                    </span>
                  </div>
                  <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.65, marginBottom:10 }}>{ev.description}</p>
                  <p style={{ color:"#475569", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                    <Calendar style={{ width:12, height:12 }} />
                    {formatDate(ev.date)}{ev.endDate && ` — ${formatDate(ev.endDate)}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
