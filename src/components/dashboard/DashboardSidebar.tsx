"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Rocket, Camera, FolderOpen,
  DollarSign, Package, BookOpen, Calendar, ClipboardList,
  Leaf, ChevronLeft, ChevronRight, Home, Download, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const NAV = [
  { group: "Utama",     items: [{ href: "/dashboard",             label: "Overview",       icon: LayoutDashboard }] },
  { group: "Manajemen", items: [
    { href: "/dashboard/anggota",    label: "Anggota",        icon: Users },
    { href: "/dashboard/proker",     label: "Program Kerja",  icon: Rocket },
    { href: "/dashboard/keuangan",   label: "Keuangan",       icon: DollarSign },
    { href: "/dashboard/inventory",  label: "Inventaris",     icon: Package },
  ]},
  { group: "Konten",    items: [
    { href: "/dashboard/dokumentasi", label: "Dokumentasi",   icon: Camera },
    { href: "/dashboard/arsip",       label: "Arsip Digital", icon: FolderOpen },
    { href: "/dashboard/jurnal",      label: "Jurnal Harian", icon: BookOpen },
  ]},
  { group: "Kegiatan",  items: [
    { href: "/dashboard/absensi",    label: "Absensi",        icon: ClipboardList },
    { href: "/dashboard/piket",      label: "Jadwal Piket",   icon: Calendar },
  ]},
  { group: "Laporan",   items: [{ href: "/dashboard/export", label: "Export Laporan", icon: Download }] },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 216 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="relative flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden"
      style={{ background: "var(--bg-2)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[60px] shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-6 }} transition={{ duration:.12 }}>
              <p className="text-white font-bold text-sm leading-none">KKN 146</p>
              <p className="text-emerald-400 text-[11px] mt-0.5">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color:"var(--t3)" }}>
                {group}
              </p>
            )}
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn("nitem", active && "active", collapsed && "justify-center px-0")}
                      title={collapsed ? item.label : undefined}>
                      <item.icon className="w-[17px] h-[17px] shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.1 }}>
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 space-y-0.5 shrink-0" style={{ borderTop:"1px solid var(--border)" }}>
        <Link href="/">
          <div className={cn("nitem", collapsed && "justify-center px-0")} title={collapsed?"Landing Page":undefined}>
            <Home className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && <span>Landing Page</span>}
          </div>
        </Link>
        <button onClick={() => { logout(); router.replace("/login"); }}
          className={cn("w-full nitem hover:!text-red-400 hover:!bg-red-500/10", collapsed && "justify-center px-0")}
          title={collapsed?"Keluar":undefined}>
          <LogOut className="w-[17px] h-[17px] shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg transition-colors"
        style={{ background:"var(--bg-3)", border:"1px solid var(--border-2)", color:"var(--t2)" }}>
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
