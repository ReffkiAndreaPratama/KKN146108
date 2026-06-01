"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Package, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { inventoryItems } from "@/data/inventory";
import { InventoryItem } from "@/types";
import { cn } from "@/lib/utils";

const CAT: Record<InventoryItem["category"], { label: string; emoji: string; text: string; bg: string; border: string }> = {
  dapur:       { label: "Dapur",            emoji: "🍳", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  kebersihan:  { label: "Kebersihan",        emoji: "🧹", text: "text-cyan-400",  bg: "bg-cyan-500/10",  border: "border-cyan-500/20" },
  sekretariat: { label: "Sekretariat",       emoji: "📋", text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  p3k:         { label: "P3K",              emoji: "🏥", text: "text-red-400",    bg: "bg-red-500/10",   border: "border-red-500/20" },
  pribadi:     { label: "Kebutuhan Pribadi", emoji: "👤", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS = {
  tersedia:  { icon: CheckCircle2, color: "text-emerald-400" },
  kurang:    { icon: AlertCircle,  color: "text-amber-400" },
  tidak_ada: { icon: XCircle,      color: "text-red-400" },
};

export default function InventorySection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [cat, setCat] = useState<InventoryItem["category"] | "all">("all");

  const filtered = cat === "all" ? inventoryItems : inventoryItems.filter((i) => i.category === cat);
  const checked  = inventoryItems.filter((i) => i.checked).length;
  const progress = Math.round((checked / inventoryItems.length) * 100);

  return (
    <section id="inventory" className="py-24 sm:py-32 relative overflow-hidden bg-[#07111f]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "44px 44px" }} />

      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium mb-6">
            <Package className="w-4 h-4" /> Inventaris
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Checklist <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Perlengkapan</span></h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto mb-10">
            Daftar perlengkapan dan inventaris posko KKN 146 Desa Talang Marap.
          </p>
          
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-4 rounded-3xl bg-[#0f1e33] border border-white/10 shadow-xl mx-auto">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400 font-medium">Checklist Progress</p>
              <p className="text-white font-black text-2xl leading-none mt-1">{checked}/{inventoryItems.length}</p>
            </div>
            <div className="w-40 sm:w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                initial={{ width:0 }} animate={v?{width:`${progress}%`}:{}} transition={{ duration:1.5, delay:.4, ease: "easeOut" }} 
              />
            </div>
            <span className="font-bold text-lg text-amber-400">{progress}%</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button onClick={() => setCat("all")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border",
              cat==="all"?"bg-white/10 text-white border-white/20 shadow-lg":"bg-transparent text-slate-400 border-white/5 hover:bg-white/5 hover:text-white"
            )}>
            Semua <span className="opacity-50 font-normal ml-1">({inventoryItems.length})</span>
          </button>
          {(Object.entries(CAT) as [InventoryItem["category"], typeof CAT[InventoryItem["category"]]][]).map(([key, c]) => {
            const count = inventoryItems.filter((i) => i.category === key).length;
            return (
              <button key={key} onClick={() => setCat(key)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                  cat===key ? `${c.bg} ${c.text} ${c.border} shadow-lg` : "bg-transparent text-slate-400 border-white/5 hover:bg-white/5 hover:text-white"
                )}>
                {c.emoji} {c.label} <span className="opacity-50 font-normal ml-1">({count})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const s = STATUS[item.status];
            const c = CAT[item.category];
            return (
              <motion.div key={item.id} initial={{ opacity:0, y:10 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.3, delay:i*.025 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all border group hover:scale-[1.02]",
                  item.checked ? "bg-emerald-500/5 border-emerald-500/20" : "bg-[#0f1e33] border-white/5 hover:border-white/10"
                )}>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border", c.bg, c.border)}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-sm sm:text-base leading-tight truncate transition-colors", 
                    item.checked ? "text-slate-500 line-through" : "text-white group-hover:text-amber-400")}>
                    {item.name}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-1 truncate">
                    {item.quantity} {item.unit}
                    {item.owner && <><span className="mx-1.5 opacity-30">•</span>{item.owner}</>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                  <s.icon className={cn("w-4 h-4", s.color)} />
                  {item.checked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20 bg-[#0f1e33]/50 rounded-3xl border border-white/5 mt-8">
            <Package className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 font-medium">Tidak ada item di kategori ini.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
