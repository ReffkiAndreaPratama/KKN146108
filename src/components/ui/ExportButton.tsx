"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportOption {
  label: string;
  format: "pdf" | "excel";
  onClick: () => Promise<void>;
}

interface ExportButtonProps {
  options: ExportOption[];
  label?: string;
  className?: string;
}

export function ExportButton({ options, label = "Export", className }: ExportButtonProps) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone]       = useState<string | null>(null);

  const handleClick = async (opt: ExportOption) => {
    setOpen(false);
    setLoading(opt.label);
    try {
      await opt.onClick();
      setDone(opt.label);
      setTimeout(() => setDone(null), 2500);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost flex items-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : done ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{loading ? "Mengekspor..." : done ? "Selesai!" : label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-40 w-52 rounded-2xl bg-[#0d1526] border border-white/[0.08] shadow-2xl overflow-hidden"
            >
              <div className="p-1.5">
                {options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleClick(opt)}
                    disabled={!!loading}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-50 text-left"
                  >
                    {opt.format === "pdf" ? (
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium leading-tight">{opt.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {opt.format === "pdf" ? "Format PDF" : "Format Excel (.xlsx)"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
