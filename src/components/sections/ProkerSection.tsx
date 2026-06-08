"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Rocket, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useProker } from "@/hooks/useProker";
import { prokerList as seedProker } from "@/data/proker";
import { cn } from "@/lib/utils";
import type { ProkerRow } from "@/types/database";

const CAT: Record<string, { label: string; text: string; bg: string }> = {
  pendidikan: { label: "Pendidikan", text: "text-blue-400", bg: "bg-blue-500/10" },
  sosial: { label: "Sosial", text: "text-pink-400", bg: "bg-pink-500/10" },
  teknologi: { label: "Teknologi", text: "text-cyan-400", bg: "bg-cyan-500/10" },
  lingkungan: { label: "Lingkungan", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  umkm: { label: "UMKM", text: "text-amber-400", bg: "bg-amber-500/10" },
  kesehatan: { label: "Kesehatan", text: "text-red-400", bg: "bg-red-500/10" },
  keagamaan: { label: "Keagamaan", text: "text-purple-400", bg: "bg-purple-500/10" },
  administrasi: { label: "Administrasi", text: "text-slate-400", bg: "bg-slate-500/10" },
};

const STATUS: Record<string, { label: string; icon: typeof CheckCircle2; text: string }> = {
  planning: { label: "Planning", icon: AlertCircle, text: "text-amber-400" },
  ongoing: { label: "Ongoing", icon: Clock, text: "text-cyan-400" },
  completed: { label: "Completed", icon: CheckCircle2, text: "text-emerald-400" },
};

export default function ProkerSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [fCat, setFCat] = useState("all");

  const { data: dbProker } = useProker();
  // Prioritas DB, fallback seed — dedup berdasarkan nama untuk hindari duplikat
  const rawProker = (dbProker ?? seedProker) as unknown as ProkerRow[];
  const proker = dbProker
    ? rawProker
    : rawProker.filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i);
  const filtered = fCat === "all" ? proker : proker.filter((p) => p.category === fCat);
  const avg = proker.length ? Math.round(proker.reduce((a, p) => a + p.progress, 0) / proker.length) : 0;

  return (
    <section id="proker" className="py-24 sm:py-32" style={{ background:"#0d1525" }} ref={ref}>
      <div className="wrapper">
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} style={{ textAlign:"center", marginBottom:32 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-5">
            <Rocket className="w-3.5 h-3.5" /> Program Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Program Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">KKN 146</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", textAlign:"center" }} className="mb-8">{proker.length} program kerja lintas bidang untuk memberdayakan masyarakat Desa Talang Marap.</p>
          
          <div style={{ display:"inline-flex", alignItems:"center", gap:16, background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:999, padding:"12px 20px" }}>
            <span style={{ fontSize:14, color:"#94a3b8" }}>Progress:</span>
            <div style={{ width:128, height:8, background:"rgba(255,255,255,0.06)", borderRadius:999, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(to right, #10b981, #06b6d4)", borderRadius:999, width:`${avg}%` }} />
            </div>
            <span style={{ fontSize:14, color:"#fff", fontWeight:700 }}>{avg}%</span>
          </div>
        </motion.div>

        {/* Filter */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:32 }}>
          {["all", ...Object.keys(CAT)].map((k) => (
            <button key={k} onClick={() => setFCat(k)}
              style={{ padding:"8px 16px", borderRadius:999, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.2s", background: fCat === k ? "rgba(255,255,255,0.1)" : "transparent", color: fCat === k ? "#fff" : "#94a3b8", border: fCat === k ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent" }}>
              {k === "all" ? "Semua" : CAT[k].label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }} className="max-sm:!grid-cols-1 max-md:!grid-cols-2">
          {filtered.map((p, i) => {
            const sc = STATUS[p.status] ?? STATUS.planning;
            const cat = CAT[p.category] ?? CAT.administrasi;
            return (
              <motion.div key={p.id} initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:i*.04 }}
                className="bg-[#111b2e] border border-white/[0.06] rounded-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", cat.bg, cat.text)}>{cat.label}</span>
                  <span className={cn("flex items-center gap-1 text-[11px] font-medium", sc.text)}><sc.icon className="w-3 h-3" />{sc.label}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{p.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1 line-clamp-2">{p.description}</p>
                <div className="text-xs text-slate-500 mb-3">
                  <span>{p.ketua_pelaksana}</span> · <span>{p.target}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-500">Progress</span><span className="text-white font-bold">{p.progress}%</span></div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full bg-gradient-to-r", p.progress === 100 ? "from-emerald-500 to-teal-400" : p.progress >= 50 ? "from-cyan-500 to-emerald-400" : "from-amber-500 to-orange-400")} style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
