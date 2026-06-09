"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Users, Instagram, X, GraduationCap } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { cn } from "@/lib/utils";
import type { MemberRow } from "@/types/database";

const gc       = (m: MemberRow) => (m as any).color       ?? "from-emerald-500 to-cyan-500";
const gi       = (m: MemberRow) => (m as any).initials    ?? m.name.split(" ").map((w:string)=>w[0]).join("").slice(0,2).toUpperCase();
const gdpl     = (m: MemberRow) => (m as any).dpl         as string | null ?? null;
const gdplPhoto= (m: MemberRow) => (m as any).dpl_photo_url as string | null ?? null;

const DIVISION_ORDER = ["Ketua","Sekretaris","Bendahara","Humas","Humas & Acara","Acara","PDD"];

const DPL = {
  name: "Dr. Baihaqi, SE., M.Si., Ak., CA., CAPM., ACPA., CERA.",
  nip:  "NIP: 19700603 199903 1 001",
  info: "Jurusan Akuntansi · FEB Universitas Bengkulu",
};

function MemberCard({ m, i, v, onClick }: { m: MemberRow; i: number; v: boolean; onClick: ()=>void }) {
  return (
    <motion.div
      initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay: 0.05 * i }}
      onClick={onClick}
      className="bg-[#111b2e] border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/20 transition-all group">
      {m.photo_url ? (
        <div style={{ width:"100%", aspectRatio:"3/4", overflow:"hidden", background:"#0d1525" }}>
          <img src={m.photo_url} alt={m.name}
            className="group-hover:scale-105 transition-transform duration-300"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
        </div>
      ) : (
        <div className={cn("w-full bg-gradient-to-br flex items-center justify-center text-white font-black", gc(m))}
          style={{ aspectRatio:"3/4", fontSize:52 }}>
          {gi(m)}
        </div>
      )}
      <div style={{ padding:"14px 16px", textAlign:"center" }}>
        <p className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1">{m.name}</p>
        <p className="text-xs text-emerald-400 font-medium mb-1">{m.role}</p>
        <p className="text-[10px] text-slate-500 font-mono">{m.nim}</p>
        {m.quote && <p className="text-[10px] text-slate-400 italic mt-2 line-clamp-2 leading-relaxed">&ldquo;{m.quote}&rdquo;</p>}
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const v   = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<MemberRow | null>(null);
  const { data: dbMembers } = useMembers();
  const rawMembers = (dbMembers ?? seedMembers) as unknown as MemberRow[];

  // Urutkan: Ketua → Sekretaris → Bendahara → lainnya
  const members = [...rawMembers].sort((a, b) => {
    const ai = DIVISION_ORDER.indexOf(a.division);
    const bi = DIVISION_ORDER.indexOf(b.division);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const dplName  = rawMembers.length > 0 ? (gdpl(rawMembers[0]) ?? DPL.name) : DPL.name;
  const dplPhoto = rawMembers.length > 0 ? gdplPhoto(rawMembers[0]) : null;

  return (
    <section id="tim" className="py-24 sm:py-32" style={{ background:"#0b1121" }} ref={ref}>
      <div className="wrapper">

        {/* ── Judul ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-5">
            <Users className="w-3.5 h-3.5" /> Tim KKN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Anggota KKN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">146</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto" }}>
            {members.length} mahasiswa dari berbagai fakultas Universitas Bengkulu yang berdedikasi mengabdi di Desa Talang Marap.
          </p>
        </motion.div>

        {/* ── Card DPL — sama persis seperti kartu anggota ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.05 }}
          style={{ maxWidth:220, margin:"0 auto 48px" }}>
          <div className="bg-[#111b2e] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-lg shadow-emerald-900/20">
            {/* Foto DPL — full cover seperti card anggota */}
            {dplPhoto ? (
              <div style={{ width:"100%", aspectRatio:"3/4", overflow:"hidden", background:"#0d1525" }}>
                <img src={dplPhoto} alt="DPL"
                  style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
              </div>
            ) : (
              <div style={{ width:"100%", aspectRatio:"3/4", background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <GraduationCap style={{ width:64, height:64, color:"#fff" }} />
              </div>
            )}
            {/* Keterangan DPL */}
            <div style={{ padding:"14px 16px 20px", textAlign:"center" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#34d399", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
                Dosen Pembimbing Lapangan
              </p>
              <p style={{ color:"#fff", fontWeight:700, fontSize:13, lineHeight:1.4, marginBottom:4 }}>{dplName}</p>
              <p style={{ color:"#64748b", fontSize:11, marginBottom:2 }}>{DPL.nip}</p>
              <p style={{ color:"#94a3b8", fontSize:11 }}>{DPL.info}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Grid Anggota — 4 kolom, urut Ketua → Sek → Ben → lainnya ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }} className="max-sm:!grid-cols-2 max-md:!grid-cols-2">
          {members.map((m, i) => (
            <MemberCard key={m.id} m={m} i={i} v={v} onClick={() => setSelected(m)} />
          ))}
        </div>

        <p style={{ textAlign:"center", color:"#94a3b8", fontSize:14, marginTop:48 }}>
          Terdiri dari <span style={{ color:"#34d399", fontWeight:700 }}>6 Fakultas</span> — Teknik, Pertanian, Ekonomi & Bisnis, FKIP, FISIP, dan Hukum
        </p>
      </div>

      {/* ── Modal detail anggota ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale:.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:.9, y:16 }}
              className="bg-[#111b2e] border border-white/[0.08] rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}>

              {/* Foto besar full width */}
              {selected.photo_url ? (
                <div style={{ width:"100%", aspectRatio:"4/3", overflow:"hidden" }}>
                  <img src={selected.photo_url} alt={selected.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                </div>
              ) : (
                <div className={cn("w-full bg-gradient-to-br flex items-center justify-center text-white font-black text-6xl", gc(selected))}
                  style={{ aspectRatio:"4/3" }}>
                  {gi(selected)}
                </div>
              )}

              {/* Info */}
              <div style={{ padding:"20px 20px 24px" }}>
                <h3 className="text-white font-bold text-base leading-snug mb-1">{selected.name}</h3>
                <p className="text-emerald-400 text-sm font-medium mb-4">{selected.role}</p>

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    { label:"NIM",      value: selected.nim },
                    { label:"Fakultas", value: selected.faculty },
                    { label:"Prodi",    value: selected.prodi },
                    ...(gdpl(selected) ? [{ label:"DPL", value: gdpl(selected)! }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display:"flex", flexDirection:"column", gap:2, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:10, fontWeight:600, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
                      <span style={{ fontSize:13, color:"#f0f6ff", fontWeight:500, lineHeight:1.4 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {selected.quote && (
                  <p className="text-xs italic text-slate-400 mt-4 text-center leading-relaxed">&ldquo;{selected.quote}&rdquo;</p>
                )}
                {selected.instagram && (
                  <a href={`https://instagram.com/${selected.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-pink-400 hover:text-pink-300">
                    <Instagram className="w-4 h-4" />@{selected.instagram}
                  </a>
                )}
              </div>

              <button onClick={() => setSelected(null)}
                style={{ position:"absolute", top:12, right:12, width:32, height:32, borderRadius:99, background:"rgba(0,0,0,0.5)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(4px)" }}>
                <X style={{ width:16, height:16, color:"#fff" }} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
