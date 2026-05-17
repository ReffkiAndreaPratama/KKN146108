"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();
  return (
    <header className="h-[60px] flex items-center justify-between px-6 sticky top-0 z-40 shrink-0"
      style={{ background:"rgba(12,26,46,0.88)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)" }}>
      {/* Search */}
      <div className="relative w-full max-w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:"var(--t3)" }} />
        <input type="text" placeholder="Cari anggota, proker..." className="inp pl-9 py-2 text-[13px]" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 ml-4">
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06]"
          style={{ color:"var(--t2)" }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>

        <div className="w-px h-5 mx-1" style={{ background:"var(--border)" }} />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/20">
            AK
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-[13px] font-semibold leading-none">Admin KKN</p>
            <p className="text-[11px] mt-0.5" style={{ color:"var(--t3)" }}>Super Admin</p>
          </div>
        </div>

        <button onClick={() => { logout(); router.replace("/login"); }}
          className="ml-1 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10 hover:text-red-400"
          style={{ color:"var(--t2)" }} title="Keluar">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
