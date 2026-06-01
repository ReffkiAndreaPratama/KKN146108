"use client";

import { motion } from "framer-motion";
import { Users, Rocket, DollarSign, Package, CheckCircle2, Clock, AlertCircle, Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useProker } from "@/hooks/useProker";
import { useTransactions } from "@/hooks/useTransactions";
import { members as seedM } from "@/data/members";
import { prokerList as seedP } from "@/data/proker";
import { transactions as seedT } from "@/data/finance";
import { inventoryItems } from "@/data/inventory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MemberRow, ProkerRow, TransactionRow } from "@/types/database";

const ACT = [
  { day:"Sen",v:2},{day:"Sel",v:4},{day:"Rab",v:3},
  {day:"Kam",v:5},{day:"Jum",v:6},{day:"Sab",v:4},{day:"Min",v:2},
];

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const cardP: React.CSSProperties = { ...card, padding:24 };

export default function DashboardPage() {
  const { data: dbM } = useMembers();
  const { data: dbP } = useProker();
  const { data: dbT } = useTransactions();

  const members = (dbM ?? seedM) as unknown as MemberRow[];
  const proker  = (dbP ?? seedP) as unknown as ProkerRow[];
  const txList  = (dbT ?? seedT) as unknown as TransactionRow[];

  const completed = proker.filter((p) => p.status==="completed").length;
  const ongoing   = proker.filter((p) => p.status==="ongoing").length;
  const planning  = proker.filter((p) => p.status==="planning").length;
  const avgProg   = proker.length ? Math.round(proker.reduce((a,p)=>a+p.progress,0)/proker.length) : 0;
  const income    = txList.filter((t)=>t.type==="income").reduce((a,t)=>a+t.amount,0);
  const expense   = txList.filter((t)=>t.type==="expense").reduce((a,t)=>a+t.amount,0);
  const balance   = income - expense;
  const checked   = inventoryItems.filter((i)=>i.checked).length;

  const STATS = [
    { label:"Total Anggota",  value:members.length.toString(), sub:"Mahasiswa aktif", icon:Users, color:"#10b981" },
    { label:"Program Kerja",  value:proker.length.toString(), sub:`${ongoing} sedang berjalan`, icon:Rocket, color:"#06b6d4" },
    { label:"Saldo Kas",      value:formatCurrency(balance), sub:"Dari total anggaran", icon:DollarSign, color:"#8b5cf6" },
    { label:"Inventaris",     value:`${checked}/${inventoryItems.length}`, sub:"Item sudah dicek", icon:Package, color:"#f59e0b" },
  ];

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Dashboard</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Selamat datang di sistem informasi KKN 146 Desa Talang Marap</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-md:!grid-cols-2">
        {STATS.map((s) => (
          <div key={s.label} style={{ ...cardP, borderColor:`${s.color}25`, background:`${s.color}08` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:`${s.color}15` }}>
                <s.icon style={{ width:16, height:16, color:s.color }} />
              </div>
              <TrendingUp style={{ width:14, height:14, color:s.color, opacity:0.5 }} />
            </div>
            <p style={{ fontSize:22, fontWeight:700, color:"#fff" }}>{s.value}</p>
            <p style={{ fontSize:13, fontWeight:600, color:s.color, marginTop:4 }}>{s.label}</p>
            <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }} className="max-lg:!grid-cols-1">
        {/* Area chart */}
        <div style={cardP}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Aktivitas Mingguan</p>
              <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Jumlah kegiatan per hari</p>
            </div>
            <Activity style={{ width:16, height:16, color:"#34d399" }} />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={ACT} margin={{ top:0, right:0, bottom:0, left:-24 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:12 }} />
              <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#g1)" name="Kegiatan" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Proker status */}
        <div style={cardP}>
          <p style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:20 }}>Status Proker</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Completed", count:completed, icon:CheckCircle2, color:"#10b981" },
              { label:"Ongoing", count:ongoing, icon:Clock, color:"#06b6d4" },
              { label:"Planning", count:planning, icon:AlertCircle, color:"#f59e0b" },
            ].map((item) => (
              <div key={item.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:`${item.color}15` }}>
                    <item.icon style={{ width:16, height:16, color:item.color }} />
                  </div>
                  <span style={{ fontSize:13, color:"#94a3b8" }}>{item.label}</span>
                </div>
                <span style={{ fontSize:18, fontWeight:700, color:item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:8 }}>
              <span style={{ color:"#64748b" }}>Progress rata-rata</span>
              <span style={{ color:"#34d399", fontWeight:700 }}>{avgProg}%</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${avgProg}%`, background:"linear-gradient(to right, #10b981, #06b6d4)", borderRadius:99 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="max-lg:!grid-cols-1">
        {/* Transactions */}
        <div style={{ ...card, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Transaksi Terbaru</p>
            <span style={{ fontSize:12, fontWeight:600, color:"#34d399" }}>{formatCurrency(balance)}</span>
          </div>
          {txList.slice(0,5).map((tx, i) => (
            <div key={tx.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background: tx.type==="income" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                  {tx.type==="income" ? <ArrowUpRight style={{ width:14, height:14, color:"#34d399" }} /> : <ArrowDownRight style={{ width:14, height:14, color:"#f87171" }} />}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:"#fff" }}>{tx.description}</p>
                  <p style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{formatDate(tx.date)}</p>
                </div>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color: tx.type==="income" ? "#34d399" : "#f87171" }}>
                {tx.type==="income"?"+":"−"}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{ ...card, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Tim KKN 146</p>
            <span style={{ fontSize:12, color:"#64748b" }}>{members.length} anggota</span>
          </div>
          {members.map((m, i) => (
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom: i < members.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>
                {((m as unknown as {initials?:string}).initials ?? m.name[0])}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:500, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</p>
                <p style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{m.prodi}</p>
              </div>
              <span style={{ fontSize:10, fontWeight:600, color:"#34d399", background:"rgba(16,185,129,0.1)", padding:"3px 8px", borderRadius:99 }}>{m.division}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
