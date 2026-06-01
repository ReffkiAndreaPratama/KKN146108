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
    { label: "Total Pemasukan",   value: income,   icon: TrendingUp,   text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Pengeluaran", value: expense,  icon: TrendingDown, text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
    { label: "Saldo Tersisa",     value: balance,  icon: Wallet,       text: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
  ];

  return (
    <section id="keuangan" className="py-24 sm:py-32 relative overflow-hidden bg-[#0c1a2e]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "52px 52px" }} />

      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" /> Laporan Keuangan
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Transparansi <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Keuangan</span></h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
            Laporan transparansi pemasukan dan pengeluaran KKN 146 Desa Talang Marap.
          </p>
        </motion.div>

        {/* Summary Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {SUMS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:.95 }} animate={v?{opacity:1,scale:1}:{}} transition={{ duration:.4, delay:.2+i*.08 }}
              className={cn("rounded-3xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-xl bg-[#0f1e33] hover:border-white/20", s.border)}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border", s.bg, s.border)}>
                <s.icon className={cn("w-6 h-6", s.text)} />
              </div>
              <p className="text-white font-black text-3xl sm:text-4xl leading-none mb-3">{formatCurrency(s.value)}</p>
              <p className={cn("text-sm font-bold uppercase tracking-widest", s.text)}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity:0, x:-20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.5, delay:.3 }} 
            className="bg-[#0f1e33] border border-white/10 rounded-3xl p-6 sm:p-8 hover:border-white/20 transition-all shadow-xl shadow-black/10">
            <h3 className="text-white font-bold text-lg mb-8">Distribusi Pengeluaran</h3>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="shrink-0 w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetSummary.categories} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="amount" strokeWidth={0} paddingAngle={2}>
                      {budgetSummary.categories.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4 min-w-0 w-full">
                {budgetSummary.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ background:cat.color }} />
                      <span className="text-sm font-medium text-slate-300 truncate">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.5, delay:.35 }} 
            className="bg-[#0f1e33] border border-white/10 rounded-3xl p-6 sm:p-8 hover:border-white/20 transition-all shadow-xl shadow-black/10">
            <h3 className="text-white font-bold text-lg mb-8">Pemasukan vs Pengeluaran</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY} barSize={16} margin={{ left:-20, bottom: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill:"#94a3b8", fontSize:12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill:"#94a3b8", fontSize:11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}jt`} dx={-10} />
                  <Tooltip cursor={{ fill:"rgba(255,255,255,0.02)" }} contentStyle={{ background:"#0c1a2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", color:"#fff", fontSize:"13px", padding: "12px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }} formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="income"  fill="#10b981" radius={[6,6,0,0]} name="Pemasukan" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[6,6,0,0]} name="Pengeluaran" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Transactions List */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.5, delay:.45 }}
          className="bg-[#0f1e33] border border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-black/10">
          <div className="px-6 sm:px-8 py-5 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-bold text-lg">Riwayat Transaksi Terakhir</h3>
          </div>
          <div className="divide-y divide-white/5">
            {txList.slice(0, 8).map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity:0, x:-10 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.3, delay:.5+i*.04 }}
                className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 transition-colors hover:bg-white/[0.03] group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110",
                    tx.type==="income" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20")}>
                    {tx.type==="income" ? <ArrowUpRight className="w-5 h-5 text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-white leading-tight mb-1 group-hover:text-emerald-400 transition-colors">{tx.description}</p>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">{formatDate(tx.date)} <span className="mx-1.5 opacity-30">•</span> {tx.category}</p>
                  </div>
                </div>
                <span className={cn("font-black text-sm sm:text-base shrink-0", tx.type==="income"?"text-emerald-400":"text-red-400")}>
                  {tx.type==="income"?"+":"−"}{formatCurrency(tx.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
