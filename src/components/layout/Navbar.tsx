"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "tentang", label: "Tentang" },
  { id: "tim", label: "Tim" },
  { id: "proker", label: "Proker" },
  { id: "timeline", label: "Timeline" },
  { id: "dokumentasi", label: "Dokumentasi" },
  { id: "piket", label: "Piket" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      for (const link of [...LINKS].reverse()) {
        const el = document.getElementById(link.id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(link.id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all 0.3s", background: scrolled ? "rgba(11,17,33,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div className="wrapper" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
          <button onClick={() => go("home")} style={{ display:"flex", alignItems:"center", gap:12, background:"none", border:"none", cursor:"pointer" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Leaf style={{ width:18, height:18, color:"#fff" }} />
            </div>
            <div><p style={{ color:"#fff", fontWeight:700, fontSize:14 }}>KKN 146</p><p style={{ color:"#34d399", fontSize:11 }}>Talang Marap</p></div>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:999, border:"1px solid rgba(255,255,255,0.06)" }} className="max-lg:!hidden">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)}
                style={{ padding:"8px 16px", borderRadius:999, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", transition:"all 0.2s", background: active === l.id ? "rgba(16,185,129,0.1)" : "transparent", color: active === l.id ? "#34d399" : "#94a3b8" }}>
                {l.label}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Link href="/login" style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontSize:13, fontWeight:600, borderRadius:999, textDecoration:"none" }} className="max-sm:!hidden">
              <LayoutDashboard style={{ width:14, height:14 }} /> Dashboard
            </Link>
            <button onClick={() => setOpen(!open)} style={{ width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", cursor:"pointer" }} className="lg:!hidden">
              {open ? <X style={{ width:20, height:20 }} /> : <Menu style={{ width:20, height:20 }} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            style={{ position:"fixed", top:76, left:16, right:16, zIndex:40, borderRadius:16, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(17,27,46,0.97)", backdropFilter:"blur(16px)", padding:16 }} className="lg:!hidden">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"12px 16px", borderRadius:12, fontSize:14, fontWeight:500, border:"none", cursor:"pointer", background: active === l.id ? "rgba(16,185,129,0.1)" : "transparent", color: active === l.id ? "#34d399" : "#94a3b8" }}>
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
