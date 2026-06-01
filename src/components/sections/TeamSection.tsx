"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Users, Instagram, X, Quote, GraduationCap, Hash } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { cn } from "@/lib/utils";
import type { MemberRow } from "@/types/database";

const gc = (m: MemberRow) => (m as unknown as { color?: string }).color ?? "from-emerald-500 to-cyan-500";
const gi = (m: MemberRow) => (m as unknown as { initials?: string }).initials ?? m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function TeamSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<MemberRow | null>(null);
  const { data: dbMembers } = useMembers();
  const members = (dbMembers ?? seedMembers) as unknown as MemberRow[];

  return (
    <section id="tim" className="py-24 sm:py-32" style={{ background:"#0b1121" }} ref={ref}>
      <div className="wrapper">
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-5">
            <Users className="w-3.5 h-3.5" /> Tim KKN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Anggota KKN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">146</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", textAlign:"center" }}>{members.length} mahasiswa dari berbagai fakultas Universitas Bengkulu yang berdedikasi mengabdi di Desa Talang Marap.</p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-sm:!grid-cols-1 max-md:!grid-cols-2">
          {members.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:i*.05 }}
              onClick={() => setSelected(m)}
              className="bg-[#111b2e] border border-white/[0.06] rounded-2xl p-6 text-center cursor-pointer hover:border-white/[0.12] transition-all group">
              <div className={cn("w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl mb-4", gc(m))}>
                {gi(m)}
              </div>
              <p className="text-white font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">{m.name}</p>
              <p className="text-xs text-slate-400 mb-1">{m.role}</p>
              <p className="text-[11px] text-slate-500 font-mono">{m.nim}</p>
              {m.quote && <p className="text-[11px] text-slate-400 italic mt-3 line-clamp-2">&ldquo;{m.quote}&rdquo;</p>}
            </motion.div>
          ))}
        </div>

        <p style={{ textAlign:"center", color:"#94a3b8", fontSize:14, marginTop:40 }}>
          Terdiri dari <span style={{ color:"#34d399", fontWeight:700 }}>6 Fakultas</span> — Teknik, Pertanian, Ekonomi & Bisnis, FKIP, FISIP, dan Hukum
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale:.9 }} animate={{ scale:1 }} exit={{ scale:.9 }}
              className="bg-[#111b2e] border border-white/[0.08] rounded-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className={cn("h-20 bg-gradient-to-br", gc(selected))} />
              <div className="px-6 pb-6 -mt-10 text-center">
                <div className={cn("w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl border-4 border-[#111b2e]", gc(selected))}>{gi(selected)}</div>
                <h3 className="text-white font-bold text-lg mt-3">{selected.name}</h3>
                <p className="text-emerald-400 text-sm">{selected.role}</p>
                <div className="mt-4 space-y-2 text-left bg-white/[0.03] rounded-xl p-4 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">NIM</span><span className="text-white font-medium">{selected.nim}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Fakultas</span><span className="text-white font-medium">{selected.faculty}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Prodi</span><span className="text-white font-medium">{selected.prodi}</span></div>
                </div>
                {selected.quote && <p className="text-sm italic text-slate-400 mt-4">&ldquo;{selected.quote}&rdquo;</p>}
                {selected.instagram && (
                  <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300">
                    <Instagram className="w-4 h-4" />@{selected.instagram}
                  </a>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
