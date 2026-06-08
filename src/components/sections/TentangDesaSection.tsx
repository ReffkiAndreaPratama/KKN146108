"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Users, Mountain, BookOpen, Briefcase, TreePine, Landmark } from "lucide-react";
import Image from "next/image";

const INFO = [
  { label: "Nama Desa", value: "Talang Marap" },
  { label: "Kecamatan", value: "Kelam Tengah" },
  { label: "Kabupaten", value: "Kaur" },
  { label: "Provinsi", value: "Bengkulu" },
  { label: "Koordinat", value: "4°34'24.2\"S 103°12'25.4\"E" },
];

const POTENSI = [
  { icon: TreePine, title: "Pertanian & Perkebunan", desc: "Lahan subur dengan komoditas padi, kopi, dan sayuran.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=75" },
  { icon: Mountain, title: "Wisata Alam", desc: "Keindahan alam pegunungan dan sungai yang masih alami.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75" },
  { icon: Briefcase, title: "UMKM Lokal", desc: "Usaha mikro kecil menengah yang berpotensi berkembang.", img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=75" },
  { icon: Users, title: "Budaya Lokal", desc: "Kekayaan budaya dan tradisi masyarakat Bengkulu.", img: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=400&q=75" },
];

export default function TentangDesaSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="tentang" style={{ padding:"96px 0", background:"#0d1525" }} ref={ref}>
      <div className="wrapper">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} style={{ textAlign:"center", marginBottom:48 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:999, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#34d399", fontSize:12, fontWeight:500, marginBottom:20 }}>
            <MapPin style={{ width:14, height:14 }} /> Profil Desa
          </span>
          <h2 style={{ fontSize:"clamp(1.75rem, 4vw, 3rem)", fontWeight:900, color:"#fff", marginBottom:12 }}>
            Tentang Desa <span style={{ background:"linear-gradient(to right, #34d399, #22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Talang Marap</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:560, margin:"0 auto", lineHeight:1.6 }}>
            Desa yang kaya akan potensi alam dan budaya lokal di Kecamatan Kelam Tengah, Kabupaten Kaur, Provinsi Bengkulu.
          </p>
        </motion.div>

        {/* Image Banner */}
        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:.1 }}
          style={{ position:"relative", width:"100%", height:320, borderRadius:20, overflow:"hidden", marginBottom:48, border:"1px solid rgba(255,255,255,0.06)" }}>
          <Image src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=80" alt="Desa" fill style={{ objectFit:"cover" }} sizes="100vw" />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #0d1525, transparent)" }} />
          <div style={{ position:"absolute", bottom:24, left:24 }}>
            <p style={{ color:"#34d399", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Kecamatan Kelam Tengah</p>
            <h3 style={{ color:"#fff", fontWeight:900, fontSize:28 }}>Desa Talang Marap</h3>
          </div>
        </motion.div>

        {/* Two columns: Profil + Map */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:24, marginBottom:48 }} className="lg:!grid-cols-2">
          {/* Profil Card */}
          <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:.2 }}
            style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Landmark style={{ width:20, height:20, color:"#34d399" }} />
              </div>
              <h3 style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Profil Singkat</h3>
            </div>
            {INFO.map((item) => (
              <div key={item.label} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color:"#94a3b8", fontSize:14 }}>{item.label}</span>
                <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>{item.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Map + Sejarah */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:.25 }}
              style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:12, flex:1, minHeight:200, overflow:"hidden" }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.234!2d103.20697!3d-4.57339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzQnMjQuMiJTIDEwM8KwMTInMjUuNCJF!5e0!3m2!1sid!2sid!4v1700000000000"
                width="100%" height="100%" style={{ borderRadius:12, border:"none" }} allowFullScreen loading="lazy" title="Peta Desa Talang Marap" />
            </motion.div>
            <motion.div initial={{ opacity:0, y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:.3 }}
              style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"rgba(6,182,212,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <BookOpen style={{ width:20, height:20, color:"#22d3ee" }} />
                </div>
                <h3 style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Sejarah Singkat</h3>
              </div>
              <p style={{ color:"#94a3b8", fontSize:14, lineHeight:1.7 }}>
                Desa Talang Marap merupakan salah satu desa di Kecamatan Kelam Tengah yang memiliki sejarah panjang. Masyarakatnya dikenal ramah dan menjunjung tinggi nilai-nilai gotong royong.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:48 }} className="max-sm:!grid-cols-2">
          {[
            { icon: Users, value: "~1.200", label: "Penduduk", color: "#34d399" },
            { icon: Mountain, value: "±45 km²", label: "Luas Wilayah", color: "#22d3ee" },
            { icon: Landmark, value: "~320", label: "Jumlah KK", color: "#a78bfa" },
            { icon: BookOpen, value: "SD–SMA", label: "Pendidikan", color: "#fbbf24" },
          ].map((s) => (
            <div key={s.label} style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:24, textAlign:"center" }}>
              <s.icon style={{ width:24, height:24, color:s.color, margin:"0 auto 12px" }} />
              <p style={{ color:"#fff", fontWeight:900, fontSize:22, marginBottom:4 }}>{s.value}</p>
              <p style={{ color:"#94a3b8", fontSize:12 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Potensi */}
        <h3 style={{ color:"#fff", fontWeight:700, fontSize:20, textAlign:"center", marginBottom:32 }}>Potensi Desa</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-sm:!grid-cols-1 max-md:!grid-cols-2">
          {POTENSI.map((item) => (
            <div key={item.title} style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ position:"relative", height:140, overflow:"hidden" }}>
                <Image src={item.img} alt={item.title} fill style={{ objectFit:"cover" }} sizes="25vw" />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #111b2e, transparent)" }} />
              </div>
              <div style={{ padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <item.icon style={{ width:16, height:16, color:"#34d399" }} />
                  <h4 style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{item.title}</h4>
                </div>
                <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
