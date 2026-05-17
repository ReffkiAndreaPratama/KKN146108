"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Rocket, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useProker } from "@/hooks/useProker";
import { prokerList as seedProker } from "@/data/proker";
import { cn } from "@/lib/utils";
import type { ProkerRow } from "@/types/database";

const CAT: Record<string, { label: string; cls: string }> = {
  pendidikan:   { label: "Pendidikan",   cls: "bdg-blue" },
  sosial:       { label: "Sosial",       cls: "bdg-pink" },
  teknologi:    { label: "Teknologi",    cls: "bdg-cyan" },
  lingkungan:   { label: "Lingkungan",   cls: "bdg-green" },
  umkm:         { label: "UMKM",         cls: "bdg-amber" },
  kesehatan:    { label: "Kesehatan",    cls: "bdg-red" },
  keagamaan:    { label: "Keagamaan",    cls: "bdg-violet" },
  administrasi: { label: "Administrasi", cls: "bdg-slate" },
};

const STATUS = {
  planning:  { label: "Planning",  icon: AlertCircle,  cls: "bdg-amber", color: "#f59e0b" },
  ongoing:   { label: "Ongoing",   icon: Clock,        cls: "bdg-cyan",  color: "#06b6d4" },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bdg-green", color: "#10b981" },
};

const PROG_COLOR = (p: number) =>
  p === 100 ? "from-emerald-500 to-teal-400" : p >= 50 ? "from-cyan-500 to-emerald-400" : "from-amber-500 to-orange-400";

export default function ProkerSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [fCat, setFCat]       = useState("all");
  const [fStatus, setFStatus] = useState("all");

  const { data: dbProker } = useProker();
  const proker = (dbProker ?? seedProker) as unknown as ProkerRow[];
  const filtered = proker.filter((p) => (fCat === "all" || p.category === fCat) && (fStatus === "all" || p.status === fStatus));
  const avg = proker.length ? Math.round(proker.reduce((a, p) => a + p.progress, 0) / proker.length) : 0;

  return (
    <section id="proker" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "rgba(139,92,246,0.04)" }} />

      <div className="cx" ref={ref}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-12">
          <div className="sbdg inline-flex"><Rocket className="w-3.5 h-3.5" />Program Kerja</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Program Kerja <span className="gt">KKN 146</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8" style={{ color:"var(--t2)" }}>
            {proker.length} program kerja lintas bidang untuk memberdayakan masyarakat Desa Talang Marap.
          </p>
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <div className="text-left">
              <p className="text-xs" style={{ color:"var(--t3)" }}>Progress Keseluruhan</p>
              <p className="text-white font-bold text-lg leading-none mt-0.5">{avg}%</p>
            </div>
            <div className="w-28 ptrack">
              <motion.div className="pfill" initial={{ width:0 }} animate={v?{width:`${avg}%`}:{}} transition={{ duration:1.5, delay:.4 }} />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.2 }} className="flex flex-col gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {["all", ...Object.keys(CAT)].map((k) => (
              <button key={k} onClick={() => setFCat(k)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  fCat === k ? (k === "all" ? "text-white bg-white/10 border-white/20" : cn("bdg", CAT[k]?.cls)) : "border-white/[0.08] hover:bg-white/[0.06]"
                )}
                style={{ color: fCat === k && k !== "all" ? undefined : fCat === k ? "#fff" : "var(--t2)" }}>
                {k === "all" ? "Semua Kategori" : CAT[k].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "planning", "ongoing", "completed"] as const).map((s) => (
              <button key={s} onClick={() => setFStatus(s)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  fStatus === s ? "text-white bg-white/10 border-white/20" : "border-white/[0.08] hover:bg-white/[0.06]"
                )}
                style={{ color: fStatus === s ? "#fff" : "var(--t2)" }}>
                {s === "all" ? "Semua Status" : STATUS[s].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const sc = STATUS[p.status];
            return (
              <motion.div key={p.id} initial={{ opacity:0, y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.45, delay:.1+i*.07 }}
                className="card card-p card-hover flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={cn("bdg", CAT[p.category]?.cls ?? "bdg-slate")}>{CAT[p.category]?.label ?? p.category}</span>
                  <span className={cn("bdg flex items-center gap-1", sc.cls)}><sc.icon className="w-3 h-3" />{sc.label}</span>
                </div>
                <h3 className="text-white font-bold text-sm leading-snug mb-2">{p.name}</h3>
                <p className="text-xs leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color:"var(--t2)" }}>{p.description}</p>
                <div className="flex items-center justify-between text-xs py-3 mb-4" style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
                  <div>
                    <p className="mb-0.5" style={{ color:"var(--t3)" }}>Ketua Pelaksana</p>
                    <p className="font-medium text-white">{p.ketua_pelaksana}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5" style={{ color:"var(--t3)" }}>Target</p>
                    <p className="font-medium text-white">{p.target}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color:"var(--t3)" }}>Progress</span>
                    <span className="font-bold text-emerald-400">{p.progress}%</span>
                  </div>
                  <div className="ptrack">
                    <motion.div initial={{ width:0 }} animate={v?{width:`${p.progress}%`}:{}} transition={{ duration:1, delay:.3+i*.05 }}
                      className={cn("pfill bg-gradient-to-r", PROG_COLOR(p.progress))} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color:"var(--t3)" }}>
            <Rocket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada program kerja yang sesuai filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
