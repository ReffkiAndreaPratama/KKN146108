"use client";

import { motion } from "framer-motion";
import { Package, CheckCircle2, AlertCircle, XCircle, Plus } from "lucide-react";
import { inventoryItems } from "@/data/inventory";
import { InventoryItem } from "@/types";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportInventarisPDF, exportInventarisExcel } from "@/lib/export";
import { cn } from "@/lib/utils";
import { useState } from "react";

const categoryConfig: Record<InventoryItem["category"], { label: string; emoji: string; color: string }> = {
  dapur:       { label: "Dapur",            emoji: "🍳", color: "amber" },
  kebersihan:  { label: "Kebersihan",        emoji: "🧹", color: "cyan" },
  sekretariat: { label: "Sekretariat",       emoji: "📋", color: "violet" },
  p3k:         { label: "P3K",              emoji: "🏥", color: "red" },
  pribadi:     { label: "Kebutuhan Pribadi", emoji: "👤", color: "emerald" },
};

const colorMap: Record<string, string> = {
  amber:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
  cyan:    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  violet:  "bg-violet-500/10 border-violet-500/20 text-violet-400",
  red:     "bg-red-500/10 border-red-500/20 text-red-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
};

const statusConfig = {
  tersedia:  { icon: CheckCircle2, color: "text-emerald-400", label: "Tersedia" },
  kurang:    { icon: AlertCircle,  color: "text-amber-400",   label: "Kurang" },
  tidak_ada: { icon: XCircle,      color: "text-red-400",     label: "Tidak Ada" },
};

export default function InventoryDashboardPage() {
  const [activeCategory, setActiveCategory] = useState<InventoryItem["category"] | "all">("all");
  const [items, setItems] = useState(inventoryItems);

  const filtered = activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);
  const checkedCount = items.filter((i) => i.checked).length;
  const progress = Math.round((checkedCount / items.length) * 100);

  const toggleCheck = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventaris & Checklist</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola perlengkapan KKN 146</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#111827] border border-white/[0.07]">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold text-sm">{checkedCount}/{items.length}</span>
            <div className="w-20 progress-track">
              <div className="progress-fill transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-emerald-400 text-sm font-bold">{progress}%</span>
          </div>
          <ExportButton
            options={[
              { label: "Export PDF",   format: "pdf",   onClick: () => exportInventarisPDF(items) },
              { label: "Export Excel", format: "excel", onClick: () => exportInventarisExcel(items) },
            ]}
          />
          <button className="btn-primary text-sm py-2.5 px-4">
            <Plus className="w-4 h-4" />
            Tambah Item
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
            activeCategory === "all"
              ? "bg-white/[0.12] text-white border-white/[0.15]"
              : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.07]"
          )}
        >
          Semua ({items.length})
        </button>
        {(Object.entries(categoryConfig) as [InventoryItem["category"], typeof categoryConfig[InventoryItem["category"]]][]).map(([key, cat]) => {
          const count = items.filter((i) => i.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                activeCategory === key ? colorMap[cat.color] : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.07]"
              )}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111827] border border-white/[0.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["✓", "Item", "Kategori", "Jumlah", "Pemilik", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const status = statusConfig[item.status];
                const StatusIcon = status.icon;
                const cat = categoryConfig[item.category];
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    className={cn("table-row", item.checked && "bg-emerald-500/[0.03]")}
                  >
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                          item.checked
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-white/[0.15] hover:border-emerald-500/50"
                        )}
                      >
                        {item.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("text-sm font-medium", item.checked ? "text-slate-500 line-through" : "text-white")}>
                        {item.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-400">{cat.emoji} {cat.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-sm">{item.quantity} {item.unit}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-sm">{item.owner || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("flex items-center gap-1 text-xs font-medium", status.color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
