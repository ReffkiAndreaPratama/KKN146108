"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Package, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { inventoryItems } from "@/data/inventory";
import { InventoryItem } from "@/types";
import { cn } from "@/lib/utils";

const CAT: Record<InventoryItem["category"], { label: string; emoji: string; color: string }> = {
  dapur:       { label: "Dapur",            emoji: "🍳", color: "#f59e0b" },
  kebersihan:  { label: "Kebersihan",        emoji: "🧹", color: "#06b6d4" },
  sekretariat: { label: "Sekretariat",       emoji: "📋", color: "#8b5cf6" },
  p3k:         { label: "P3K",              emoji: "🏥", color: "#ef4444" },
  pribadi:     { label: "Kebutuhan Pribadi", emoji: "👤", color: "#10b981" },
};

const STATUS = {
  tersedia:  { icon: CheckCircle2, color: "#10b981" },
  kurang:    { icon: AlertCircle,  color: "#f59e0b" },
  tidak_ada: { icon: XCircle,      color: "#ef4444" },
};

export default function InventorySection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [cat, setCat] = useState<InventoryItem["category"] | "all">("all");

  const filtered = cat === "all" ? inventoryItems : inventoryItems.filter((i) => i.category === cat);
  const checked  = inventoryItems.filter((i) => i.checked).length;
  const progress = Math.round((checked / inventoryItems.length) * 100);

  return (
    <section id="inventory" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "rgba(245,158,11,0.04)" }} />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-12">
          <div className="sbdg inline-flex"><Package className="w-3.5 h-3.5" />Inventaris</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Checklist <span className="gt">Perlengkapan</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ color:"var(--t2)" }}>
            Daftar perlengkapan dan inventaris KKN 146 Desa Talang Marap.
          </p>
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <div className="text-left">
              <p className="text-xs" style={{ color:"var(--t3)" }}>Checklist Progress</p>
              <p className="text-white font-bold text-lg leading-none mt-0.5">{checked}/{inventoryItems.length}</p>
            </div>
            <div className="w-28 ptrack">
              <motion.div className="pfill" initial={{ width:0 }} animate={v?{width:`${progress}%`}:{}} transition={{ duration:1.5, delay:.4 }} />
            </div>
            <span className="font-bold text-sm text-emerald-400">{progress}%</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.2 }}
          className="flex flex-wrap gap-2 justify-center mb-8">
          <button onClick={() => setCat("all")}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              cat==="all"?"text-white bg-white/10 border-white/20":"border-white/[0.08] hover:bg-white/[0.06]"
            )}
            style={{ color: cat==="all"?"#fff":"var(--t2)" }}>
            Semua ({inventoryItems.length})
          </button>
          {(Object.entries(CAT) as [InventoryItem["category"], typeof CAT[InventoryItem["category"]]][]).map(([key, c]) => {
            const count = inventoryItems.filter((i) => i.category === key).length;
            return (
              <button key={key} onClick={() => setCat(key)}
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                style={{
                  background: cat===key?`${c.color}15`:"rgba(255,255,255,0.04)",
                  border: `1px solid ${cat===key?`${c.color}30`:"rgba(255,255,255,0.08)"}`,
                  color: cat===key?c.color:"var(--t2)",
                }}>
                {c.emoji} {c.label} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => {
            const s = STATUS[item.status];
            const c = CAT[item.category];
            return (
              <motion.div key={item.id} initial={{ opacity:0, y:10 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.3, delay:i*.025 }}
                className="flex items-center gap-3.5 p-4 rounded-xl transition-all"
                style={{
                  background: item.checked?"rgba(16,185,129,0.05)":"var(--surface)",
                  border: `1px solid ${item.checked?"rgba(16,185,129,0.15)":"var(--border)"}`,
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background:`${c.color}15`, border:`1px solid ${c.color}25` }}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-sm leading-tight", item.checked?"line-through":"text-white")}
                    style={{ color: item.checked?"var(--t3)":undefined }}>
                    {item.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>
                    {item.quantity} {item.unit}{item.owner&&` · ${item.owner}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <s.icon className="w-3.5 h-3.5" style={{ color:s.color }} />
                  {item.checked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
