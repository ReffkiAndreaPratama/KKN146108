"use client";

import { useState } from "react";
import { ClipboardList, CheckCircle2, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import type { MemberRow } from "@/types/database";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };

type Status = "hadir" | "izin" | "sakit" | "alpha";
const STATUS_CFG: Record<Status, { label:string; color:string; icon:typeof CheckCircle2 }> = {
  hadir: { label:"Hadir", color:"#34d399", icon:CheckCircle2 },
  izin: { label:"Izin", color:"#fbbf24", icon:Clock },
  sakit: { label:"Sakit", color:"#60a5fa", icon:AlertCircle },
  alpha: { label:"Alpha", color:"#f87171", icon:XCircle },
};

function fmtDate(d: string) { return new Intl.DateTimeFormat("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date(d)); }
function addDays(d: string, n: number) { const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().split("T")[0]; }

export default function AbsensiPage() {
  const { data: dbMembers } = useMembers();
  const allMembers = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<Record<string, Record<string, Status>>>({});

  const getStatus = (id: string): Status => records[date]?.[id] ?? "hadir";
  const setStatus = (id: string, s: Status) => setRecords((p) => ({ ...p, [date]: { ...(p[date]??{}), [id]: s } }));

  const counts = (Object.keys(STATUS_CFG) as Status[]).reduce((a, s) => { a[s] = allMembers.filter((m) => getStatus(m.id) === s).length; return a; }, {} as Record<Status, number>);

  return (
    <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Absensi</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Rekap kehadiran anggota KKN 146</p>
      </div>

      {/* Date Nav */}
      <div style={{ ...card, padding:16, display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => setDate(addDays(date,-1))} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronLeft style={{ width:16, height:16 }} />
        </button>
        <div style={{ flex:1, textAlign:"center" }}>
          <p style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{fmtDate(date)}</p>
          {date === today && <p style={{ color:"#34d399", fontSize:11, marginTop:2 }}>Hari Ini</p>}
        </div>
        <button onClick={() => setDate(addDays(date,1))} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"none", color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronRight style={{ width:16, height:16 }} />
        </button>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }} className="max-sm:!grid-cols-2">
        {(Object.entries(STATUS_CFG) as [Status, typeof STATUS_CFG[Status]][]).map(([key, cfg]) => (
          <div key={key} style={{ ...card, padding:16, textAlign:"center", borderColor:`${cfg.color}25`, background:`${cfg.color}08` }}>
            <cfg.icon style={{ width:20, height:20, color:cfg.color, margin:"0 auto 8px" }} />
            <p style={{ color:cfg.color, fontWeight:700, fontSize:20 }}>{counts[key]}</p>
            <p style={{ color:"#94a3b8", fontSize:11, marginTop:2 }}>{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:10 }}>
          <ClipboardList style={{ width:16, height:16, color:"#34d399" }} />
          <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Daftar Hadir</span>
        </div>
        {allMembers.map((m, i) => {
          const current = getStatus(m.id);
          return (
            <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", borderBottom: i < allMembers.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700 }}>
                  {m.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div>
                  <p style={{ color:"#fff", fontSize:13, fontWeight:500 }}>{m.name}</p>
                  <p style={{ color:"#64748b", fontSize:11 }}>{m.role}</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {(Object.entries(STATUS_CFG) as [Status, typeof STATUS_CFG[Status]][]).map(([key, cfg]) => (
                  <button key={key} onClick={() => setStatus(m.id, key)}
                    style={{ padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", border:"1px solid", display:"flex", alignItems:"center", gap:4,
                      background: current===key ? `${cfg.color}15` : "rgba(255,255,255,0.03)",
                      color: current===key ? cfg.color : "#64748b",
                      borderColor: current===key ? `${cfg.color}30` : "rgba(255,255,255,0.06)" }}>
                    <cfg.icon style={{ width:12, height:12 }} />{cfg.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
