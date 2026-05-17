"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LINKS = [
  { id: "home",        label: "Home" },
  { id: "tentang",     label: "Tentang" },
  { id: "tim",         label: "Tim" },
  { id: "proker",      label: "Proker" },
  { id: "timeline",    label: "Timeline" },
  { id: "dokumentasi", label: "Dokumentasi" },
  { id: "keuangan",    label: "Keuangan" },
  { id: "kontak",      label: "Kontak" },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState("home");

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

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(7,17,31,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        }}
      >
        <div className="cx">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => go("home")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-white font-bold text-sm">KKN 146</p>
                <p className="text-emerald-400 text-[11px] mt-0.5">Talang Marap</p>
              </div>
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)}
                  className={cn(
                    "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    active === l.id ? "text-emerald-400" : "text-[var(--t2)] hover:text-white"
                  )}>
                  {l.label}
                  {active === l.id && (
                    <motion.div layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)" }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <span className="btn btn-primary hidden sm:inline-flex text-sm cursor-pointer">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </span>
              </Link>
              <button onClick={() => setOpen(!open)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--t2)", background: open ? "rgba(255,255,255,0.07)" : "transparent" }}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 inset-x-0 z-40 lg:hidden"
            style={{ background: "rgba(7,17,31,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="cx py-4 space-y-1">
              {LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: active === l.id ? "#10b981" : "var(--t2)",
                    background: active === l.id ? "rgba(16,185,129,0.08)" : "transparent",
                  }}>
                  {l.label}
                </button>
              ))}
              <Link href="/login" onClick={() => setOpen(false)}>
                <div className="btn btn-primary w-full justify-center mt-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard Admin
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
