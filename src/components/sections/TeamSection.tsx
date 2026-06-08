"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Users, Instagram, X, GraduationCap } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { cn } from "@/lib/utils";
import type { MemberRow } from "@/types/database";

const gc = (m: MemberRow) => (m as unknown as { color?: string }).color ?? "from-emerald-500 to-cyan-500";
const gi = (m: MemberRow) => (m as unknown as { initials?: string }).initials ?? m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const gdpl = (m: MemberRow) => (m as unknown as { dpl?: string | null }).dpl ?? null;
export default function TeamSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<MemberRow | null>(null);
  const { data: dbMembers } = useMembers();
  const members = (dbMembers ?? seedMembers) as unknown as MemberRow[];

  // Ambil DPL dari anggota pertama (semua sama)
  const dplName = members.length > 0 ? gdpl(members[0]) : null;
  const dplPhoto = members.length > 0 ? ((members[0] as unknown as { dpl_photo_url?: string | null }).dpl_photo_url ?? null) : null;

  return (
    <section id="tim" className="py-24 sm:py-32" style={{ background:"#0b1121" }} ref={ref}>
      <div className="wrapper">

        {/* Judul */}
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-5">
            <Users className="w-3.5 h-3.5" /> Tim KKN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Anggota KKN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">146</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", textAlign:"center" }}>
            {members.length} mahasiswa dari berbagai fakultas Universitas Bengkulu yang berdedikasi mengabdi di Desa Talang Marap.
          </p>
        </motion.div>

        {/* Box DPL — satu box tengah di atas */}
        {dplName && (
          <motion.div
            initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.1 }}
            style={{ maxWidth:560, margin:"0 auto 32px" }}
          >
            <div style={{
              background:"linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))",
              border:"1px solid rgba(16,185,129,0.2)",
              borderRadius:16,
              padding:"20px 28px",
              textAlign:"center",
            }}>
              <p style={{ fontSize:11, fontWeight:600, color:"#34d399", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
                Dosen Pembimbing Lapangan
              </p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
                {/* Foto DPL */}
                {dplPhoto ? (
                  <div style={{ width:64, height:64, borderRadius:16, overflow:"hidden", border:"2px solid rgba(16,185,129,0.3)", flexShrink:0 }}>
                    <img src={dplPhoto} alt="DPL" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                ) : (
                  <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <GraduationCap style={{ width:28, height:28, color:"#fff" }} />
                  </div>
                )}
                <div style={{ textAlign:"left" }}>
                  <p style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{dplName}</p>
                  <p style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>Jurusan Akuntansi · FEB Universitas Bengkulu</p>
                  <p style={{ color:"#64748b", fontSize:11, marginTop:2 }}>NIP: 19700603 199903 1 001</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Anggota — 4 kolom */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-sm:!grid-cols-2 max-md:!grid-cols-2">
          {members.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => setSelected(m)}
              className="bg-[#111b2e] border border-white/[0.06] rounded-2xl p-5 text-center cursor-pointer hover:border-white/[0.12] transition-all group">
              {/* Avatar — foto jika ada, inisial jika tidak */}
              {m.photo_url ? (
                <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden mb-3 border-2 border-white/10">
                  <img src={m.photo_url} alt={m.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ) : (
                <div className={cn("w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg mb-3", gc(m))}>
                  {gi(m)}
                </div>
              )}
              <p className="text-white font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">{m.name}</p>
              <p className="text-xs text-slate-400 mb-1">{m.role}</p>
              <p className="text-[11px] text-slate-500 font-mono">{m.nim}</p>
              {m.quote && <p className="text-[10px] text-slate-400 italic mt-3 line-clamp-2">&ldquo;{m.quote}&rdquo;</p>}
            </motion.div>
          ))}
        </div>

        <p style={{ textAlign:"center", color:"#94a3b8", fontSize:14, marginTop:40 }}>
          Terdiri dari <span style={{ color:"#34d399", fontWeight:700 }}>6 Fakultas</span> — Teknik, Pertanian, Ekonomi & Bisnis, FKIP, FISIP, dan Hukum
        </p>
      </div>

      {/* Modal detail anggota */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale:.9 }} animate={{ scale:1 }} exit={{ scale:.9 }}
              className="bg-[#111b2e] border border-white/[0.08] rounded-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className={cn("h-20 bg-gradient-to-br", gc(selected))} />
              <div className="px-6 pb-6 -mt-10 text-center">
                {selected.photo_url ? (
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-4 border-[#111b2e]">
                    <img src={selected.photo_url} alt={selected.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                ) : (
                  <div className={cn("w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl border-4 border-[#111b2e]", gc(selected))}>
                    {gi(selected)}
                  </div>
                )}
                <h3 className="text-white font-bold text-lg mt-3">{selected.name}</h3>
                <p className="text-emerald-400 text-sm">{selected.role}</p>
                <div className="mt-4 space-y-2 text-left bg-white/[0.03] rounded-xl p-4 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">NIM</span><span className="text-white font-medium">{selected.nim}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Fakultas</span><span className="text-white font-medium">{selected.faculty}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Prodi</span><span className="text-white font-medium">{selected.prodi}</span></div>
                  {gdpl(selected) && (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400 shrink-0">DPL</span>
                      <span className="text-white font-medium text-right">{gdpl(selected)}</span>
                    </div>
                  )}
                </div>
                {selected.quote && <p className="text-sm italic text-slate-400 mt-4">&ldquo;{selected.quote}&rdquo;</p>}
                {selected.instagram && (
                  <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300">
                    <Instagram className="w-4 h-4" />@{selected.instagram}
                  </a>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
