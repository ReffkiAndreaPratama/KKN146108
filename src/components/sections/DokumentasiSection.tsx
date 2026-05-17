"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATS = ["Semua", "Survey", "Rapat", "Kegiatan", "Gotong Royong", "Pendidikan", "Sosialisasi"];
const ITEMS = [
  { id:1, title:"Survey Lokasi KKN",     cat:"Survey",        date:"14 Mei 2026", color:"from-emerald-600 to-teal-500",  emoji:"🗺️" },
  { id:2, title:"Rapat Koordinasi Tim",  cat:"Rapat",         date:"16 Mei 2026", color:"from-cyan-600 to-blue-500",     emoji:"👥" },
  { id:3, title:"Penerimaan di Desa",    cat:"Kegiatan",      date:"29 Mei 2026", color:"from-violet-600 to-purple-500", emoji:"🏡" },
  { id:4, title:"Gotong Royong Desa",    cat:"Gotong Royong", date:"7 Jun 2026",  color:"from-amber-600 to-orange-500",  emoji:"🌿" },
  { id:5, title:"Bimbel Anak SD",        cat:"Pendidikan",    date:"1 Jun 2026",  color:"from-pink-600 to-rose-500",     emoji:"📚" },
  { id:6, title:"Sosialisasi Kesehatan", cat:"Sosialisasi",   date:"10 Jun 2026", color:"from-red-600 to-pink-500",      emoji:"🏥" },
  { id:7, title:"Pelatihan UMKM",        cat:"Kegiatan",      date:"5 Jun 2026",  color:"from-indigo-600 to-blue-500",   emoji:"💼" },
  { id:8, title:"Pengajian Rutin",       cat:"Kegiatan",      date:"3 Jun 2026",  color:"from-teal-600 to-emerald-500",  emoji:"🕌" },
  { id:9, title:"Rapat Evaluasi",        cat:"Rapat",         date:"15 Jun 2026", color:"from-slate-600 to-gray-500",    emoji:"📋" },
];

export default function DokumentasiSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [cat, setCat] = useState("Semua");
  const [lb, setLb]   = useState<number | null>(null);

  const filtered = cat === "Semua" ? ITEMS : ITEMS.filter((g) => g.cat === cat);

  return (
    <section id="dokumentasi" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "rgba(236,72,153,0.04)" }} />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-12">
          <div className="sbdg inline-flex"><Camera className="w-3.5 h-3.5" />Dokumentasi</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Galeri <span className="gt">Kegiatan</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color:"var(--t2)" }}>
            Dokumentasi perjalanan dan kegiatan KKN 146 Desa Talang Marap.
          </p>
        </motion.div>

        <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.2 }}
          className="flex flex-wrap gap-2 justify-center mb-8">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                cat === c ? "text-white bg-white/10 border-white/20" : "border-white/[0.08] hover:bg-white/[0.06]"
              )}
              style={{ color: cat === c ? "#fff" : "var(--t2)" }}>
              {c}
            </button>
          ))}
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity:0, scale:.93 }} animate={v?{opacity:1,scale:1}:{}} transition={{ duration:.4, delay:i*.07 }}
              className="break-inside-avoid cursor-pointer group" onClick={() => setLb(i)}>
              <div className={cn("relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.01]",
                i%3===0?"h-64":i%3===1?"h-48":"h-56")}
                style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
                <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", item.color)}>
                  <span className="text-5xl select-none">{item.emoji}</span>
                </div>
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{item.date}</p>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-white"
                    style={{ background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)" }}>
                    {item.cat}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lb !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)" }}
            onClick={() => setLb(null)}>
            <button className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background:"rgba(255,255,255,0.1)" }} onClick={() => setLb(null)}>
              <X className="w-5 h-5" />
            </button>
            {lb > 0 && (
              <button className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background:"rgba(255,255,255,0.1)" }}
                onClick={(e) => { e.stopPropagation(); setLb((x) => Math.max(0,(x??0)-1)); }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {lb < filtered.length-1 && (
              <button className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background:"rgba(255,255,255,0.1)" }}
                onClick={(e) => { e.stopPropagation(); setLb((x) => Math.min(filtered.length-1,(x??0)+1)); }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <motion.div key={lb} initial={{ scale:.88, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:.22 }}
              className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <div className={cn("w-full h-72 rounded-2xl bg-gradient-to-br flex items-center justify-center", filtered[lb].color)}>
                <span className="text-8xl">{filtered[lb].emoji}</span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-xl">{filtered[lb].title}</h3>
                <p className="text-sm mt-1" style={{ color:"var(--t2)" }}>{filtered[lb].date} · {filtered[lb].cat}</p>
                <p className="text-xs mt-1" style={{ color:"var(--t3)" }}>{lb+1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
