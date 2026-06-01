"use client";

import { useState } from "react";
import { Bell, Search, LogOut, Menu, X, LayoutDashboard, Users, Rocket, DollarSign, Package, Camera, FolderOpen, BookOpen, ClipboardList, Calendar, Download, Home, Leaf } from "lucide-react";
import { logout } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { group:"Utama", items:[
    { href:"/dashboard", label:"Overview", icon:LayoutDashboard },
  ]},
  { group:"Manajemen", items:[
    { href:"/dashboard/anggota", label:"Anggota", icon:Users },
    { href:"/dashboard/proker", label:"Program Kerja", icon:Rocket },
    { href:"/dashboard/keuangan", label:"Keuangan", icon:DollarSign },
    { href:"/dashboard/inventory", label:"Inventaris", icon:Package },
  ]},
  { group:"Konten", items:[
    { href:"/dashboard/dokumentasi", label:"Dokumentasi", icon:Camera },
    { href:"/dashboard/arsip", label:"Arsip Digital", icon:FolderOpen },
    { href:"/dashboard/jurnal", label:"Jurnal Harian", icon:BookOpen },
  ]},
  { group:"Kegiatan", items:[
    { href:"/dashboard/absensi", label:"Absensi", icon:ClipboardList },
    { href:"/dashboard/piket", label:"Jadwal Piket", icon:Calendar },
  ]},
  { group:"Laporan", items:[
    { href:"/dashboard/export", label:"Export Laporan", icon:Download },
  ]},
];

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <>
      <header style={{ height:60, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", position:"sticky", top:0, zIndex:40, flexShrink:0, background:"rgba(11,17,33,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {/* Left: Mobile menu + Search */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileNav(true)}
            style={{ width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", cursor:"pointer" }}
            className="md:!hidden">
            <Menu style={{ width:18, height:18 }} />
          </button>

          <div style={{ position:"relative" }} className="max-sm:!hidden">
            <Search style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"#475569", pointerEvents:"none" }} />
            <input type="text" placeholder="Cari..."
              style={{ padding:"8px 12px 8px 36px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", width:200 }} />
          </div>
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700 }}>AK</div>
            <div className="max-sm:!hidden">
              <p style={{ color:"#fff", fontSize:13, fontWeight:600, lineHeight:1 }}>Admin KKN</p>
              <p style={{ color:"#475569", fontSize:11, marginTop:2 }}>Super Admin</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.replace("/login"); }}
            style={{ width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", color:"#94a3b8", cursor:"pointer", marginLeft:4 }}
            title="Keluar">
            <LogOut style={{ width:16, height:16 }} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileNav && (
        <div style={{ position:"fixed", inset:0, zIndex:60 }} className="md:!hidden">
          {/* Backdrop */}
          <div onClick={() => setMobileNav(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }} />
          
          {/* Drawer */}
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:280, background:"#0d1525", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
            {/* Drawer Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Leaf style={{ width:16, height:16, color:"#fff" }} />
                </div>
                <div>
                  <p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>KKN 146</p>
                  <p style={{ color:"#34d399", fontSize:11 }}>Dashboard</p>
                </div>
              </div>
              <button onClick={() => setMobileNav(false)} style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", cursor:"pointer" }}>
                <X style={{ width:16, height:16 }} />
              </button>
            </div>

            {/* Nav Items */}
            <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
              {NAV.map((group) => (
                <div key={group.group} style={{ marginBottom:16 }}>
                  <p style={{ padding:"0 14px", marginBottom:6, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#475569" }}>{group.group}</p>
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMobileNav(false)}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, marginBottom:2, textDecoration:"none", fontSize:13, fontWeight: active ? 600 : 400, color: active ? "#34d399" : "#94a3b8", background: active ? "rgba(16,185,129,0.1)" : "transparent" }}>
                        <item.icon style={{ width:17, height:17 }} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Bottom */}
            <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, textDecoration:"none", fontSize:13, color:"#94a3b8" }}>
                <Home style={{ width:17, height:17 }} /> Landing Page
              </Link>
              <button onClick={() => { logout(); router.replace("/login"); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, width:"100%", border:"none", background:"transparent", fontSize:13, color:"#f87171", cursor:"pointer", textAlign:"left" }}>
                <LogOut style={{ width:17, height:17 }} /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
