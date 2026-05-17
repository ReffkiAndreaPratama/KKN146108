"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Calendar, ArrowDown, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ── Countdown ──────────────────────────────────────────── */
function Countdown() {
  const end = new Date("2026-07-30T00:00:00").getTime();
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(true);
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!ok) return null;

  const labels = ["Hari", "Jam", "Menit", "Detik"];
  return (
    <div className="flex items-center gap-3">
      {Object.values(t).map((v, i) => (
        <div key={i} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <span className="text-white font-bold text-xl sm:text-2xl tabular-nums">{String(v).padStart(2,"0")}</span>
          </div>
          <p className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--t3)" }}>{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}

const STATS = [
  { label: "Anggota",       value: "8",  icon: Users },
  { label: "Program Kerja", value: "8",  icon: Zap },
  { label: "Hari KKN",      value: "63", icon: Calendar },
  { label: "Desa",          value: "1",  icon: MapPin },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
      <div className="grid-overlay absolute inset-0" />
      <div className="orb absolute top-1/4 left-1/5 w-[500px] h-[500px]" style={{ background: "rgba(16,185,129,0.07)" }} />
      <div className="orb absolute bottom-1/4 right-1/5 w-[400px] h-[400px]" style={{ background: "rgba(6,182,212,0.07)", animationDelay: "-6s" }} />

      <div className="cx relative z-10 py-32 text-center">
        {/* Badge */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
          className="sbdg inline-flex">
          <Sparkles className="w-3.5 h-3.5" />
          Universitas Bengkulu · Fakultas Teknik · Informatika
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55, delay:.08 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-3 tracking-tight">
          KKN <span className="gt">146</span>
        </motion.h1>

        <motion.h2 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.16 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--t2)" }}>
          Desa Talang Marap
        </motion.h2>

        <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.22 }}
          className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-3" style={{ color: "var(--t2)" }}>
          Pengabdian Mahasiswa untuk Membangun Desa dan Memberdayakan Masyarakat
        </motion.p>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.28 }}
          className="flex items-center justify-center gap-1.5 text-sm mb-10" style={{ color: "var(--t3)" }}>
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Kec. Kelam Tengah, Kab. Kaur, Provinsi Bengkulu
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.34 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button onClick={() => document.getElementById("proker")?.scrollIntoView({ behavior:"smooth" })}
            className="btn btn-primary text-base px-8 py-3.5">
            <Zap className="w-4 h-4" />Lihat Program Kerja
          </button>
          <Link href="/login">
            <span className="btn btn-ghost text-base px-8 py-3.5 cursor-pointer">Dashboard Admin</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.42 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto mb-14">
          {STATS.map((s) => (
            <div key={s.label} className="p-4 rounded-2xl text-center"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <s.icon className="w-4 h-4 text-emerald-400 mx-auto mb-2" />
              <p className="text-white font-bold text-2xl leading-none">{s.value}</p>
              <p className="text-xs mt-1" style={{ color:"var(--t3)" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
          className="flex flex-col items-center gap-3">
          <p className="text-[11px] uppercase tracking-widest font-medium" style={{ color:"var(--t3)" }}>
            Countdown Selesai KKN
          </p>
          <Countdown />
        </motion.div>

        {/* Scroll indicator */}
        <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
          onClick={() => document.getElementById("tentang")?.scrollIntoView({ behavior:"smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-colors"
          style={{ color:"var(--t3)" }}>
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4 bounce" />
        </motion.button>
      </div>
    </section>
  );
}
