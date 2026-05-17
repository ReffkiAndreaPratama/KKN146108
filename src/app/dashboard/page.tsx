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
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MemberRow, ProkerRow, TransactionRow } from "@/types/database";

const ACT = [
  { day:"Sen",v:2},{day:"Sel",v:4},{day:"Rab",v:3},
  {day:"Kam",v:5},{day:"Jum",v:6},{day:"Sab",v:4},{day:"Min",v:2},
];

const f = (i: number) => ({
  initial:{opacity:0,y:14},
  animate:{opacity:1,y:0},
  transition:{duration:.35,delay:i*.07,ease:"easeOut"},
});

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
    { label:"Total Anggota",  value:members.length.toString(),                  sub:"Mahasiswa aktif",           icon:Users,     color:"#10b981" },
    { label:"Program Kerja",  value:proker.length.toString(),                   sub:`${ongoing} sedang berjalan`, icon:Rocket,    color:"#06b6d4" },
    { label:"Saldo Kas",      value:formatCurrency(balance),                    sub:"Dari total anggaran",        icon:DollarSign,color:"#8b5cf6" },
    { label:"Inventaris",     value:`${checked}/${inventoryItems.length}`,      sub:"Item sudah dicek",           icon:Package,   color:"#f59e0b" },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Title */}
      <motion.div {...f(0)}>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color:"var(--t2)" }}>Selamat datang di sistem informasi KKN 146 Desa Talang Marap</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s,i) => (
          <motion.div key={s.label} {...f(i+1)} className="card card-p"
            style={{ background:`${s.color}0d`, border:`1px solid ${s.color}25` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:`${s.color}18`, border:`1px solid ${s.color}28` }}>
                <s.icon className="w-4 h-4" style={{ color:s.color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5" style={{ color:s.color, opacity:.5 }} />
            </div>
            <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
            <p className="text-[13px] font-semibold mt-1" style={{ color:s.color }}>{s.label}</p>
            <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div {...f(5)} className="card card-p lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[13px] font-semibold text-white">Aktivitas Mingguan</p>
              <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>Jumlah kegiatan per hari</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={ACT} margin={{ top:0, right:0, bottom:0, left:-24 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill:"#4a6080", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#4a6080", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#0c1a2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", color:"#fff", fontSize:"12px" }} cursor={{ stroke:"rgba(16,185,129,0.15)" }} />
              <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#g1)" name="Kegiatan" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Proker status */}
        <motion.div {...f(6)} className="card card-p">
          <p className="text-[13px] font-semibold text-white mb-5">Status Proker</p>
          <div className="space-y-4">
            {[
              { label:"Completed", count:completed, icon:CheckCircle2, color:"#10b981" },
              { label:"Ongoing",   count:ongoing,   icon:Clock,        color:"#06b6d4" },
              { label:"Planning",  count:planning,  icon:AlertCircle,  color:"#f59e0b" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:`${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color:item.color }} />
                  </div>
                  <span className="text-[13px]" style={{ color:"var(--t2)" }}>{item.label}</span>
                </div>
                <span className="text-xl font-bold" style={{ color:item.color }}>{item.count}</span>
              </div>
            ))}
            <div className="pt-3" style={{ borderTop:"1px solid var(--border)" }}>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color:"var(--t3)" }}>Progress rata-rata</span>
                <span className="font-bold text-emerald-400">{avgProg}%</span>
              </div>
              <div className="ptrack">
                <motion.div className="pfill" initial={{ width:0 }} animate={{ width:`${avgProg}%` }} transition={{ duration:1.2, delay:.8 }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transactions */}
        <motion.div {...f(7)} className="card" style={{ overflow:"hidden" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid var(--border)" }}>
            <p className="text-[13px] font-semibold text-white">Transaksi Terbaru</p>
            <span className="text-xs font-semibold text-emerald-400">{formatCurrency(balance)}</span>
          </div>
          <div>
            {txList.slice(0,5).map((tx,i) => (
              <div key={tx.id} className={cn("flex items-center justify-between px-6 py-3.5", i<4&&"border-b")}
                style={{ borderColor:"var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background:tx.type==="income"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)" }}>
                    {tx.type==="income"?<ArrowUpRight className="w-3.5 h-3.5 text-emerald-400"/>:<ArrowDownRight className="w-3.5 h-3.5 text-red-400"/>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white truncate max-w-[150px]">{tx.description}</p>
                    <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>{formatDate(tx.date)}</p>
                  </div>
                </div>
                <span className={cn("text-[13px] font-semibold shrink-0 ml-2", tx.type==="income"?"text-emerald-400":"text-red-400")}>
                  {tx.type==="income"?"+":"−"}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div {...f(8)} className="card" style={{ overflow:"hidden" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid var(--border)" }}>
            <p className="text-[13px] font-semibold text-white">Tim KKN 146</p>
            <span className="text-xs" style={{ color:"var(--t3)" }}>{members.length} anggota</span>
          </div>
          <div>
            {members.map((m,i) => {
              const color = (m as unknown as {color?:string}).color ?? "from-emerald-500 to-cyan-500";
              const init  = (m as unknown as {initials?:string}).initials ?? m.name[0];
              return (
                <div key={m.id} className={cn("flex items-center gap-3 px-6 py-3.5", i<members.length-1&&"border-b")}
                  style={{ borderColor:"var(--border)" }}>
                  <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0", color)}>
                    {init}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{m.name}</p>
                    <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>{m.prodi}</p>
                  </div>
                  <span className="bdg bdg-green text-[10px]">{m.division}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
