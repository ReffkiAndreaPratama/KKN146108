"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Users, Mountain, BookOpen, Briefcase, TreePine, ExternalLink, Landmark } from "lucide-react";

const INFO = [
  { label: "Nama Desa",  value: "Talang Marap" },
  { label: "Kecamatan", value: "Kelam Tengah" },
  { label: "Kabupaten", value: "Kaur" },
  { label: "Provinsi",  value: "Bengkulu" },
  { label: "Negara",    value: "Indonesia" },
  { label: "Koordinat", value: "-4.7°LS, 103.5°BT" },
];

const STATS = [
  { label: "Penduduk",     value: "~1.200",  icon: Users,    color: "#10b981" },
  { label: "Luas Wilayah", value: "±45 km²", icon: Mountain, color: "#06b6d4" },
  { label: "Jumlah KK",   value: "~320",    icon: Landmark, color: "#8b5cf6" },
  { label: "Pendidikan",  value: "SD–SMA",  icon: BookOpen, color: "#f59e0b" },
];

const POTENSI = [
  { icon: TreePine,  title: "Pertanian & Perkebunan", desc: "Lahan subur dengan komoditas padi, kopi, dan sayuran.",           color: "#10b981" },
  { icon: Mountain,  title: "Wisata Alam",            desc: "Keindahan alam pegunungan dan sungai yang masih alami.",          color: "#06b6d4" },
  { icon: Briefcase, title: "UMKM Lokal",             desc: "Berbagai usaha mikro kecil menengah yang berpotensi berkembang.", color: "#8b5cf6" },
  { icon: Users,     title: "Budaya Lokal",           desc: "Kekayaan budaya dan tradisi masyarakat Bengkulu yang unik.",     color: "#f59e0b" },
];

export default function TentangDesaSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="tentang" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "rgba(16,185,129,0.04)" }} />

      <div className="cx" ref={ref}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-14">
          <div className="sbdg inline-flex"><MapPin className="w-3.5 h-3.5" />Profil Desa</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Tentang Desa <span className="gt">Talang Marap</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color:"var(--t2)" }}>
            Desa yang kaya akan potensi alam dan budaya lokal di Kecamatan Kelam Tengah, Kabupaten Kaur, Provinsi Bengkulu.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.55, delay:.15 }} className="space-y-5">
            <div className="card card-p">
              <div className="flex items-center gap-2 mb-5">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-semibold text-sm">Profil Singkat</h3>
              </div>
              {INFO.map((item, i) => (
                <div key={item.label} className="flex justify-between items-center py-3 gap-4"
                  style={{ borderBottom: i < INFO.length-1 ? "1px solid var(--border)" : "none" }}>
                  <span className="text-sm" style={{ color:"var(--t2)" }}>{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="card card-p">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-semibold text-sm">Sejarah Singkat</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color:"var(--t2)" }}>
                Desa Talang Marap merupakan salah satu desa di Kecamatan Kelam Tengah yang memiliki sejarah panjang.
                Masyarakatnya dikenal ramah dan menjunjung tinggi nilai-nilai gotong royong. Desa ini terus berkembang
                dengan potensi alam dan sumber daya manusia yang dimilikinya.
              </p>
            </div>
          </motion.div>

          {/* Right: Map */}
          <motion.div initial={{ opacity:0, x:20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.55, delay:.25 }} className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden flex-1" style={{ minHeight:280, border:"1px solid var(--border)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63752.48!2d103.4!3d-4.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1f5b5b5b5b5b5b%3A0x0!2sKelam+Tengah%2C+Kaur%2C+Bengkulu!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%" height="100%"
                style={{ border:0, filter:"invert(90%) hue-rotate(180deg)", minHeight:280 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Desa Talang Marap"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card card-p-sm">
                <p className="text-xs mb-1" style={{ color:"var(--t3)" }}>Lokasi Posko</p>
                <p className="text-sm font-semibold text-white">Desa Talang Marap</p>
                <p className="text-xs text-emerald-400 mt-0.5">Kec. Kelam Tengah</p>
              </div>
              <a href="https://maps.google.com/?q=Kelam+Tengah+Kaur+Bengkulu" target="_blank" rel="noopener noreferrer"
                className="card card-p-sm flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"#10b981" }}>
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Buka Maps</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:.92 }} animate={v?{opacity:1,scale:1}:{}} transition={{ duration:.4, delay:.4+i*.08 }}
              className="card card-p text-center"
              style={{ background:`${s.color}0d`, border:`1px solid ${s.color}25` }}>
              <s.icon className="w-5 h-5 mx-auto mb-2.5" style={{ color:s.color }} />
              <p className="text-xl font-bold text-white leading-none mb-1">{s.value}</p>
              <p className="text-xs" style={{ color:"var(--t2)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Potensi */}
        <motion.div initial={{ opacity:0, y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.5 }}>
          <h3 className="text-white font-bold text-xl mb-6 text-center">Potensi Desa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POTENSI.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity:0, y:14 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.4, delay:.55+i*.08 }}
                className="card card-p card-hover">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background:`${item.color}15`, border:`1px solid ${item.color}25` }}>
                  <item.icon className="w-5 h-5" style={{ color:item.color }} />
                </div>
                <h4 className="text-white font-semibold text-sm mb-2 leading-snug">{item.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color:"var(--t2)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
