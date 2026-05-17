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

const DIV_CLS: Record<string, string> = {
  Ketua: "bdg-green", Sekretaris: "bdg-cyan", Bendahara: "bdg-rose",
  Humas: "bdg-amber", "Humas & Acara": "bdg-orange", Acara: "bdg-fuchsia", PDD: "bdg-indigo",
};

function MemberCard({ m, onClick, i }: { m: MemberRow; onClick: () => void; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.07 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card card-p card-hover cursor-pointer flex flex-col gap-4"
    >
      {/* Avatar */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl shadow-lg", gc(m))}>
            {gi(m)}
          </div>
          <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-white text-[9px] font-bold",
            m.gender === "Perempuan" ? "bg-pink-500" : "bg-blue-500")}
            style={{ borderColor: "var(--surface)" }}>
            {m.gender === "Perempuan" ? "♀" : "♂"}
          </div>
        </div>
        <span className={cn("bdg", DIV_CLS[m.division] ?? "bdg-slate")}>{m.division}</span>
      </div>

      {/* Info */}
      <div className="text-center flex-1">
        <p className="text-white font-bold text-sm leading-snug line-clamp-2">{m.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--t2)" }}>{m.role}</p>
        <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--t3)" }}>{m.nim}</p>
        {m.quote && (
          <p className="text-xs mt-3 italic leading-relaxed line-clamp-2" style={{ color: "var(--t3)" }}>
            &ldquo;{m.quote}&rdquo;
          </p>
        )}
      </div>

      <p className="text-center text-[11px] text-emerald-500 font-medium">Lihat Detail →</p>
    </motion.div>
  );
}

function MemberModal({ m, onClose }: { m: MemberRow; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--t2)", background: "rgba(255,255,255,0.07)" }}>
          <X className="w-4 h-4" />
        </button>

        {/* Header strip */}
        <div className={cn("h-20 bg-gradient-to-br", gc(m))} />

        <div className="px-8 pb-8">
          <div className="flex flex-col items-center text-center -mt-10 mb-5">
            <div className={cn("w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4", gc(m))}
              style={{ borderColor: "var(--bg-2)" }}>
              {gi(m)}
            </div>
            <span className={cn("bdg mt-3", DIV_CLS[m.division] ?? "bdg-slate")}>{m.division}</span>
            <h2 className="text-white font-bold text-xl mt-2 leading-snug">{m.name}</h2>
            <p className="text-sm text-emerald-400 font-medium mt-0.5">{m.role}</p>
          </div>

          {/* Details */}
          <div className="rounded-xl overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
            {[
              { icon: Hash,          label: "NIM",      value: m.nim },
              { icon: GraduationCap, label: "Fakultas", value: m.faculty },
              { icon: GraduationCap, label: "Prodi",    value: m.prodi },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-start gap-3 px-4 py-3"
                style={{ borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
                <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--t3)" }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--t3)" }}>{item.label}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {m.quote && (
            <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
              <Quote className="w-3.5 h-3.5 text-emerald-500 mb-2" />
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--t2)" }}>{m.quote}</p>
            </div>
          )}

          {m.instagram && (
            <a href={`https://instagram.com/${m.instagram}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", color: "#f472b6" }}>
              <Instagram className="w-4 h-4" />@{m.instagram}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<MemberRow | null>(null);

  const { data: dbMembers } = useMembers();
  const members = (dbMembers ?? seedMembers) as unknown as MemberRow[];

  return (
    <section id="tim" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-14">
          <div className="sbdg inline-flex"><Users className="w-3.5 h-3.5" />Tim KKN</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Anggota KKN <span className="gt">146</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto" style={{ color:"var(--t2)" }}>
            {members.length} mahasiswa dari berbagai fakultas Universitas Bengkulu yang berdedikasi mengabdi di Desa Talang Marap.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.map((m, i) => (
            <MemberCard key={m.id} m={m} i={i} onClick={() => setSelected(m)} />
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:.8 }}
          className="mt-10 p-5 rounded-2xl text-center"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid var(--border)" }}>
          <p className="text-sm" style={{ color:"var(--t2)" }}>
            Terdiri dari <span className="text-emerald-400 font-semibold">6 Fakultas</span> berbeda —
            Teknik, Pertanian, Ekonomi & Bisnis, FKIP, FISIP, dan Hukum
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <MemberModal m={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
