"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { transactions as seedTx, budgetSummary } from "@/data/finance";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { TransactionRow } from "@/types/database";

const MONTHLY = [
  { month: "Mei",    income: 1600000, expense: 3100000 },
  { month: "Jun W1", income: 1400000, expense: 1530000 },
  { month: "Jun W2", income: 1400000, expense: 1400000 },
];

export default function KeuanganSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  const { data: dbTx } = useTransactions();
  const txList = (dbTx ?? seedTx) as unknown as TransactionRow[];
  const income  = txList.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = txList.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const SUMS = [
    { label: "Total Pemasukan",   value: income,   icon: TrendingUp,   color: "#10b981" },
    { label: "Total Pengeluaran", value: expense,  icon: TrendingDown, color: "#ef4444" },
    { label: "Saldo Tersisa",     value: balance,  icon: Wallet,       color: "#06b6d4" },
  ];

  return (
    <section id="keuangan" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute top-0 right-1/4 w-[500px] h-[500px] pointer-events-none" style={{ background: "rgba(16,185,129,0.04)" }} />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-12">
          <div className="sbdg inline-flex"><DollarSign className="w-3.5 h-3.5" />Keuangan</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Laporan <span className="gt">Keuangan</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color:"var(--t2)" }}>
            Transparansi keuangan KKN 146 Desa Talang Marap.
          </p>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {SUMS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={v?{opacity:1,scale:1}:{}} transition={{ duration:.4, delay:.2+i*.08 }}
              className="card card-p" style={{ background:`${s.color}0d`, border:`1px solid ${s.color}25` }}>
              <s.icon className="w-5 h-5 mb-3" style={{ color:s.color }} />
              <p className="text-white font-bold text-2xl leading-none mb-1.5">{formatCurrency(s.value)}</p>
              <p className="text-sm font-medium" style={{ color:s.color }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity:0, x:-18 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.5, delay:.3 }} className="card card-p">
            <h3 className="text-white font-semibold text-sm mb-5">Distribusi Pengeluaran</h3>
            <div className="flex items-center gap-5">
              <div className="shrink-0">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={budgetSummary.categories} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="amount" strokeWidth={0}>
                      {budgetSummary.categories.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                {budgetSummary.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background:cat.color }} />
                      <span className="text-xs truncate" style={{ color:"var(--t2)" }}>{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white shrink-0">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:18 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.5, delay:.35 }} className="card card-p">
            <h3 className="text-white font-semibold text-sm mb-5">Pemasukan vs Pengeluaran</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={MONTHLY} barSize={14} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill:"#4a6080", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#4a6080", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}jt`} />
                <Tooltip contentStyle={{ background:"#0c1a2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", color:"#fff", fontSize:"12px" }} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="income"  fill="#10b981" radius={[4,4,0,0]} name="Pemasukan" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Transactions */}
        <motion.div initial={{ opacity:0, y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.45 }}
          className="card" style={{ overflow:"hidden" }}>
          <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)" }}>
            <h3 className="text-white font-semibold text-sm">Riwayat Transaksi</h3>
          </div>
          {txList.slice(0, 8).map((tx, i) => (
            <motion.div key={tx.id} initial={{ opacity:0, x:-10 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.3, delay:.5+i*.04 }}
              className={cn("flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.02]", i < 7 && "border-b")}
              style={{ borderColor:"var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: tx.type==="income"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)" }}>
                  {tx.type==="income" ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-tight">{tx.description}</p>
                  <p className="text-xs mt-0.5" style={{ color:"var(--t3)" }}>{formatDate(tx.date)} · {tx.category}</p>
                </div>
              </div>
              <span className={cn("font-bold text-sm shrink-0", tx.type==="income"?"text-emerald-400":"text-red-400")}>
                {tx.type==="income"?"+":"−"}{formatCurrency(tx.amount)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
