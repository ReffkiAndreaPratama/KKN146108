"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Calendar, ArrowDown, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Countdown() {
  const end = new Date("2026-07-31T23:59:59").getTime();
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(true);
    const tick = () => { const diff = end - Date.now(); if (diff <= 0) return; setT({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) }); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  if (!ok) return null;
  const labels = ["Hari", "Jam", "Menit", "Detik"];
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:"16px" }}>
      {Object.values(t).map((v, i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:24 }}>{String(v).padStart(2,"0")}</span>
          </div>
          <p style={{ fontSize:10, marginTop:8, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em" }}>{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="home" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:"#0b1121" }}>
      {/* BG Image */}
      <div style={{ position:"absolute", inset:0 }}>
        <Image src="https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=1920&q=80" alt="" fill style={{ objectFit:"cover", opacity:0.15 }} sizes="100vw" priority />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(11,17,33,0.5), rgba(11,17,33,0.9), #0b1121)" }} />
      </div>

      <div className="wrapper" style={{ position:"relative", zIndex:10, paddingTop:128, paddingBottom:80, textAlign:"center" }}>
        {/* Badge */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:999, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#34d399", fontSize:13, fontWeight:500, marginBottom:32 }}>
          <Sparkles style={{ width:14, height:14 }} /> Universitas Bengkulu · Informatika
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
          style={{ fontSize:"clamp(3rem, 8vw, 6rem)", fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1, marginBottom:16 }}>
          KKN <span style={{ background:"linear-gradient(to right, #34d399, #22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>146</span>
        </motion.h1>

        <motion.h2 initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
          style={{ fontSize:"clamp(1.25rem, 3vw, 2rem)", fontWeight:700, color:"#e2e8f0", marginBottom:24 }}>
          Desa Talang Marap
        </motion.h2>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
          style={{ color:"#94a3b8", fontSize:16, maxWidth:520, margin:"0 auto 16px", lineHeight:1.7 }}>
          Pengabdian Mahasiswa untuk Membangun Desa dan Memberdayakan Masyarakat. Mengabdi dengan Hati, Bergerak dengan Inovasi.
        </motion.p>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.25 }}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#64748b", fontSize:14, marginBottom:48 }}>
          <MapPin style={{ width:16, height:16, color:"#34d399" }} /> Kec. Kelam Tengah, Kab. Kaur, Provinsi Bengkulu
        </motion.p>

        {/* CTA */}
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
          style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:16, marginBottom:64 }}>
          <button onClick={() => document.getElementById("proker")?.scrollIntoView({ behavior:"smooth" })}
            style={{ padding:"14px 28px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:700, borderRadius:999, border:"none", cursor:"pointer", fontSize:14, display:"inline-flex", alignItems:"center", gap:8 }}>
            <Zap style={{ width:16, height:16 }} /> Lihat Program Kerja
          </button>
          <Link href="/login" style={{ padding:"14px 28px", background:"#111b2e", border:"1px solid rgba(255,255,255,0.08)", color:"#cbd5e1", fontWeight:600, borderRadius:999, fontSize:14, textDecoration:"none" }}>
            Dashboard Admin
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
          style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, maxWidth:480, margin:"0 auto 64px" }}>
          {[
            { icon: Users, value: "8", label: "Anggota" },
            { icon: Zap, value: "8", label: "Proker" },
            { icon: Calendar, value: "45", label: "Hari" },
            { icon: MapPin, value: "1", label: "Desa" },
          ].map((s) => (
            <div key={s.label} style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:16, textAlign:"center" }}>
              <s.icon style={{ width:16, height:16, color:"#34d399", margin:"0 auto 8px" }} />
              <p style={{ color:"#fff", fontWeight:900, fontSize:20 }}>{s.value}</p>
              <p style={{ color:"#64748b", fontSize:11 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}>
          <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.15em", color:"rgba(52,211,153,0.7)", fontWeight:700, marginBottom:16 }}>Sisa Waktu Pengabdian</p>
          <Countdown />
        </motion.div>

        {/* Scroll */}
        <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.8 }}
          onClick={() => document.getElementById("tentang")?.scrollIntoView({ behavior:"smooth" })}
          style={{ marginTop:48, display:"flex", flexDirection:"column", alignItems:"center", gap:4, color:"#475569", background:"none", border:"none", cursor:"pointer", marginLeft:"auto", marginRight:"auto" }}>
          <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:700 }}>Scroll</span>
          <ArrowDown style={{ width:16, height:16 }} className="animate-float" />
        </motion.button>
      </div>
    </section>
  );
}
