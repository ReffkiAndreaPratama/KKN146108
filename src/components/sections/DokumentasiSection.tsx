"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

const CATS = ["Semua", "Survey", "Rapat", "Kegiatan", "Gotong Royong", "Pendidikan", "Sosialisasi"];
const ITEMS = [
  { id:1, title:"Survey Lokasi KKN", cat:"Survey", date:"14 Mei 2026", icon:"🗺️" },
  { id:2, title:"Rapat Koordinasi Tim", cat:"Rapat", date:"16 Mei 2026", icon:"👥" },
  { id:3, title:"Penerimaan di Desa", cat:"Kegiatan", date:"29 Mei 2026", icon:"🏡" },
  { id:4, title:"Gotong Royong Desa", cat:"Gotong Royong", date:"7 Jun 2026", icon:"🌿" },
  { id:5, title:"Bimbel Anak SD", cat:"Pendidikan", date:"1 Jun 2026", icon:"📚" },
  { id:6, title:"Sosialisasi Kesehatan", cat:"Sosialisasi", date:"10 Jun 2026", icon:"🏥" },
  { id:7, title:"Pelatihan UMKM", cat:"Kegiatan", date:"5 Jun 2026", icon:"💼" },
  { id:8, title:"Pengajian Rutin", cat:"Kegiatan", date:"3 Jun 2026", icon:"🕌" },
  { id:9, title:"Rapat Evaluasi", cat:"Rapat", date:"15 Jun 2026", icon:"📋" },
];

export default function DokumentasiSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [cat, setCat] = useState("Semua");
  const [lb, setLb] = useState<number | null>(null);
  const filtered = cat === "Semua" ? ITEMS : ITEMS.filter((g) => g.cat === cat);

  return (
    <section id="dokumentasi" className="py-24 sm:py-32" style={{ background:"#0d1525" }} ref={ref}>
      <div className="wrapper">
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} style={{ textAlign:"center", marginBottom:32 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium mb-5">
            <Camera className="w-3.5 h-3.5" /> Dokumentasi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kegiatan</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", textAlign:"center" }}>Dokumentasi perjalanan dan kegiatan KKN 146 Desa Talang Marap.</p>
        </motion.div>

        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:32 }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:"8px 16px", borderRadius:999, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 0.2s", background: cat === c ? "rgba(255,255,255,0.1)" : "transparent", color: cat === c ? "#fff" : "#94a3b8", border: cat === c ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent" }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }} className="max-sm:!grid-cols-1 max-md:!grid-cols-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:i*.05 }}
              onClick={() => setLb(i)}
              style={{ cursor:"pointer", background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, overflow:"hidden", transition:"border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
              {/* Placeholder area — gelap dengan ikon */}
              <div style={{ height:160, background:"linear-gradient(135deg, #0d1a2d, #111b2e)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:48, opacity:0.6 }}>{item.icon}</span>
                <span style={{ position:"absolute", top:12, left:12, padding:"3px 10px", borderRadius:99, background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:10, fontWeight:600, border:"1px solid rgba(16,185,129,0.2)" }}>{item.cat}</span>
              </div>
              {/* Info */}
              <div style={{ padding:"14px 18px" }}>
                <p style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:4 }}>{item.title}</p>
                <p style={{ color:"#475569", fontSize:11 }}>{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lb !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setLb(null)}>
            <motion.div initial={{ scale:.9 }} animate={{ scale:1 }} className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div style={{ width:"100%", height:260, borderRadius:20, background:"linear-gradient(135deg, #0d1a2d, #162133)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize:72, opacity:0.7 }}>{filtered[lb].icon}</span>
              </div>
              <div className="text-center bg-[#111b2e] rounded-2xl p-5 border border-white/[0.06]">
                <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:99, background:"rgba(16,185,129,0.1)", color:"#34d399", fontSize:11, fontWeight:600, marginBottom:10, border:"1px solid rgba(16,185,129,0.2)" }}>{filtered[lb].cat}</span>
                <p className="text-white font-bold text-xl mb-1">{filtered[lb].title}</p>
                <p className="text-slate-400 text-sm">{filtered[lb].date}</p>
                <p className="text-xs text-slate-600 mt-3">{lb+1} / {filtered.length}</p>
              </div>
            </motion.div>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white" onClick={() => setLb(null)}><X className="w-5 h-5" /></button>
            {lb > 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hidden sm:flex" onClick={(e) => { e.stopPropagation(); setLb(lb-1); }}><ChevronLeft className="w-5 h-5" /></button>}
            {lb < filtered.length-1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hidden sm:flex" onClick={(e) => { e.stopPropagation(); setLb(lb+1); }}><ChevronRight className="w-5 h-5" /></button>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
