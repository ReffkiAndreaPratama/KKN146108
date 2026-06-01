"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Rocket, Camera, FolderOpen,
  DollarSign, Package, BookOpen, Calendar, ClipboardList,
  Leaf, ChevronLeft, ChevronRight, Home, Download, LogOut,
} from "lucide-react";
import { logout } from "@/lib/auth";

const NAV = [
  { group: "Utama", items: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }] },
  { group: "Manajemen", items: [
    { href: "/dashboard/anggota", label: "Anggota", icon: Users },
    { href: "/dashboard/proker", label: "Program Kerja", icon: Rocket },
    { href: "/dashboard/keuangan", label: "Keuangan", icon: DollarSign },
    { href: "/dashboard/inventory", label: "Inventaris", icon: Package },
  ]},
  { group: "Konten", items: [
    { href: "/dashboard/dokumentasi", label: "Dokumentasi", icon: Camera },
    { href: "/dashboard/arsip", label: "Arsip Digital", icon: FolderOpen },
    { href: "/dashboard/jurnal", label: "Jurnal Harian", icon: BookOpen },
  ]},
  { group: "Kegiatan", items: [
    { href: "/dashboard/absensi", label: "Absensi", icon: ClipboardList },
    { href: "/dashboard/piket", label: "Jadwal Piket", icon: Calendar },
  ]},
  { group: "Laporan", items: [{ href: "/dashboard/export", label: "Export Laporan", icon: Download }] },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: collapsed ? "10px 0" : "10px 12px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? "#34d399" : "#94a3b8",
    background: active ? "rgba(16,185,129,0.1)" : "transparent",
    textDecoration: "none",
    transition: "all 0.15s",
    cursor: "pointer",
    border: "none",
    width: "100%",
    textAlign: "left" as const,
  });

  return (
    <aside style={{ width: collapsed ? 60 : 220, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, flexShrink:0, overflow:"hidden", background:"#0d1525", borderRight:"1px solid rgba(255,255,255,0.06)", transition:"width 0.2s ease" }} className="max-md:!hidden">
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 16px", height:60, borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Leaf style={{ width:16, height:16, color:"#fff" }} />
        </div>
        {!collapsed && <div><p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>KKN 146</p><p style={{ color:"#34d399", fontSize:11 }}>Dashboard</p></div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"16px 8px" }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom:20 }}>
            {!collapsed && <p style={{ padding:"0 12px", marginBottom:6, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#475569" }}>{group}</p>}
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} style={navItemStyle(active)} title={collapsed ? item.label : undefined}>
                    <item.icon style={{ width:17, height:17, flexShrink:0 }} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <Link href="/" style={navItemStyle(false)}>
          <Home style={{ width:17, height:17, flexShrink:0 }} />
          {!collapsed && <span>Landing Page</span>}
        </Link>
        <button onClick={() => { logout(); router.replace("/login"); }} style={{ ...navItemStyle(false), color:"#f87171" }}>
          <LogOut style={{ width:17, height:17, flexShrink:0 }} />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        style={{ position:"absolute", right:-12, top:72, width:24, height:24, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"#111b2e", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", cursor:"pointer", zIndex:10 }}>
        {collapsed ? <ChevronRight style={{ width:12, height:12 }} /> : <ChevronLeft style={{ width:12, height:12 }} />}
      </button>
    </aside>
  );
}
