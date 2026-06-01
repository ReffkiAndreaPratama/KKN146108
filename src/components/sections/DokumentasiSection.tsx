"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATS = ["Semua", "Survey", "Rapat", "Kegiatan", "Gotong Royong", "Pendidikan", "Sosialisasi"];
const ITEMS = [
  { id:1, title:"Survey Lokasi KKN", cat:"Survey", date:"14 Mei 2026", color:"from-emerald-500 to-teal-400", emoji:"🗺️" },
  { id:2, title:"Rapat Koordinasi Tim", cat:"Rapat", date:"16 Mei 2026", color:"from-cyan-500 to-blue-400", emoji:"👥" },
  { id:3, title:"Penerimaan di Desa", cat:"Kegiatan", date:"29 Mei 2026", color:"from-violet-500 to-purple-400", emoji:"🏡" },
  { id:4, title:"Gotong Royong Desa", cat:"Gotong Royong", date:"7 Jun 2026", color:"from-amber-500 to-orange-400", emoji:"🌿" },
  { id:5, title:"Bimbel Anak SD", cat:"Pendidikan", date:"1 Jun 2026", color:"from-pink-500 to-rose-400", emoji:"📚" },
  { id:6, title:"Sosialisasi Kesehatan", cat:"Sosialisasi", date:"10 Jun 2026", color:"from-red-500 to-pink-400", emoji:"🏥" },
  { id:7, title:"Pelatihan UMKM", cat:"Kegiatan", date:"5 Jun 2026", color:"from-indigo-500 to-blue-400", emoji:"💼" },
  { id:8, title:"Pengajian Rutin", cat:"Kegiatan", date:"3 Jun 2026", color:"from-teal-500 to-emerald-400", emoji:"🕌" },
  { id:9, title:"Rapat Evaluasi", cat:"Rapat", date:"15 Jun 2026", color:"from-slate-500 to-gray-400", emoji:"📋" },
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
            <motion.div key={item.id} initial={{ opacity:0, scale:.95 }} animate={v?{opacity:1,scale:1}:{}} transition={{ delay:i*.05 }}
              onClick={() => setLb(i)} className="cursor-pointer group">
              <div className={cn("relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-white/[0.06] group-hover:border-white/[0.12] transition-all", item.color)}>
                <span className="text-5xl sm:text-6xl select-none">{item.emoji}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-5 opacity-0 group-hover:opacity-100">
                  <div><p className="text-white font-bold text-sm">{item.title}</p><p className="text-white/70 text-xs">{item.date}</p></div>
                </div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm">{item.cat}</span>
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
              <div className={cn("w-full h-72 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4", filtered[lb].color)}>
                <span className="text-7xl">{filtered[lb].emoji}</span>
              </div>
              <div className="text-center bg-[#111b2e] rounded-2xl p-5 border border-white/[0.06]">
                <p className="text-white font-bold text-xl mb-1">{filtered[lb].title}</p>
                <p className="text-slate-400 text-sm">{filtered[lb].date}</p>
                <p className="text-xs text-slate-500 mt-3">{lb+1} / {filtered.length}</p>
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
