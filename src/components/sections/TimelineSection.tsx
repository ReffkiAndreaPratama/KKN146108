"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, CheckCircle2, Clock, Circle, MapPin, BookOpen, Car, Users, Rocket, BarChart2, Award, Home } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { cn, formatDate } from "@/lib/utils";

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

        <div style={{ maxWidth:720, marginLeft:"auto", marginRight:"auto", display:"flex", flexDirection:"column", gap:16 }}>
          {timelineEvents.map((ev, i) => {
            const cfg = S[ev.status];
            const EvIcon = ICONS[ev.icon ?? ""] ?? Calendar;
            return (
              <motion.div key={ev.id} initial={{ opacity:0, x:-12 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:i*.06 }}
                className={cn("flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border", cfg.bg, cfg.border)}>
                <div className={cn("w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.border, "border")}>
                  <EvIcon className={cn("w-5 h-5 sm:w-6 sm:h-6", cfg.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-white font-bold text-sm sm:text-base">{ev.title}</h3>
                    <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold shrink-0", cfg.text)}>
                      <cfg.Icon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mb-3 line-clamp-2">{ev.description}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(ev.date)}{ev.endDate && ` — ${formatDate(ev.endDate)}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
