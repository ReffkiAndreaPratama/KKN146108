"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, CheckCircle2, Clock, Circle, MapPin, BookOpen, Car, Users, Rocket, BarChart2, Award, Home } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { cn, formatDate } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = { MapPin, BookOpen, Car, Users, Rocket, BarChart: BarChart2, Award, Home, Calendar };

const S = {
  completed: { wrap: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.22)", dot: "rgba(16,185,129,0.12)", dotBorder: "rgba(16,185,129,0.28)", ic: "#10b981", badge: { bg: "rgba(16,185,129,0.12)", c: "#10b981" }, Icon: CheckCircle2, label: "Selesai" },
  ongoing:   { wrap: "rgba(6,182,212,0.07)",  border: "rgba(6,182,212,0.22)",  dot: "rgba(6,182,212,0.12)",  dotBorder: "rgba(6,182,212,0.28)",  ic: "#06b6d4", badge: { bg: "rgba(6,182,212,0.12)",  c: "#06b6d4" }, Icon: Clock,        label: "Berlangsung" },
  upcoming:  { wrap: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.07)", dot: "rgba(255,255,255,0.04)", dotBorder: "rgba(255,255,255,0.1)", ic: "#4a6080", badge: { bg: "rgba(255,255,255,0.06)", c: "#4a6080" }, Icon: Circle,       label: "Akan Datang" },
};

export default function TimelineSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="timeline" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute top-1/2 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "rgba(16,185,129,0.04)" }} />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-14">
          <div className="sbdg inline-flex"><Calendar className="w-3.5 h-3.5" />Timeline</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Perjalanan <span className="gt">KKN 146</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color:"var(--t2)" }}>
            Rangkaian kegiatan dari awal persiapan hingga penutupan KKN 146.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-7 top-8 bottom-8 w-px"
              style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(255,255,255,0.04), transparent)" }} />

            <div className="space-y-5">
              {timelineEvents.map((ev, i) => {
                const cfg = S[ev.status];
                const EvIcon = ICONS[ev.icon ?? ""] ?? Calendar;
                return (
                  <motion.div key={ev.id} initial={{ opacity:0, x:-18 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.45, delay:i*.09 }}
                    className="relative flex gap-5">
                    <div className="relative z-10 shrink-0">
                      <motion.div initial={{ scale:0 }} animate={v?{scale:1}:{}} transition={{ duration:.3, delay:.15+i*.09, type:"spring" }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background:cfg.dot, border:`1px solid ${cfg.dotBorder}` }}>
                        <EvIcon className="w-5 h-5" style={{ color:cfg.ic }} />
                      </motion.div>
                    </div>
                    <div className="flex-1 p-5 rounded-2xl mb-1"
                      style={{ background:cfg.wrap, border:`1px solid ${cfg.border}` }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-white font-bold text-sm leading-snug">{ev.title}</h3>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
                          style={{ background:cfg.badge.bg, color:cfg.badge.c }}>
                          <cfg.Icon className="w-3 h-3" />{cfg.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-3" style={{ color:"var(--t2)" }}>{ev.description}</p>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color:"var(--t3)" }}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(ev.date)}</span>
                        {ev.endDate && <><span>—</span><span>{formatDate(ev.endDate)}</span></>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
