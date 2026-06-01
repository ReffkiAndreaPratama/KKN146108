"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Plus, X, Save, Trash2 } from "lucide-react";
import { useTransactions, useCreateTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import { transactions as seedTx, budgetSummary } from "@/data/finance";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { TransactionRow } from "@/types/database";
import type { TransactionPayload } from "@/hooks/useTransactions";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const CATS = ["Iuran","Iuran Pangan","Transportasi","Akomodasi","Konsumsi","ATK","Perlengkapan","Lainnya"];
const EMPTY: TransactionPayload = { type:"expense", description:"", amount:0, date:new Date().toISOString().split("T")[0], category:"Lainnya", created_by:"Admin" };

export default function KeuanganPage() {
  const { data: dbTx } = useTransactions();
  const createTx = useCreateTransaction();
  const deleteTx = useDeleteTransaction();

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TransactionPayload>(EMPTY);

  const all = (dbTx ?? seedTx) as unknown as TransactionRow[];
  const income = all.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = all.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Keuangan</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Laporan keuangan KKN 146 Desa Talang Marap</p>
        </div>
        <button onClick={() => setShowForm(true)} style={btnPrimary}><Plus style={{ width:16, height:16 }} /> Tambah Transaksi</button>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }} className="max-sm:!grid-cols-1">
        {[
          { label:"Total Pemasukan", value:income, icon:TrendingUp, color:"#10b981" },
          { label:"Total Pengeluaran", value:expense, icon:TrendingDown, color:"#ef4444" },
          { label:"Saldo Tersisa", value:balance, icon:Wallet, color:"#06b6d4" },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding:24, borderColor:`${s.color}25`, background:`${s.color}08` }}>
            <s.icon style={{ width:20, height:20, color:s.color, marginBottom:12 }} />
            <p style={{ color:"#fff", fontWeight:700, fontSize:22 }}>{formatCurrency(s.value)}</p>
            <p style={{ color:s.color, fontSize:13, fontWeight:600, marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Categories */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="max-md:!grid-cols-1">
        <div style={{ ...card, padding:24 }}>
          <h3 style={{ color:"#fff", fontWeight:600, fontSize:14, marginBottom:20 }}>Distribusi Pengeluaran</h3>
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            <div style={{ width:140, height:140, flexShrink:0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={budgetSummary.categories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="amount" strokeWidth={0}>
                  {budgetSummary.categories.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              {budgetSummary.categories.map((cat) => (
                <div key={cat.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:4, background:cat.color }} />
                    <span style={{ fontSize:12, color:"#94a3b8" }}>{cat.name}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ ...card, padding:24 }}>
          <h3 style={{ color:"#fff", fontWeight:600, fontSize:14, marginBottom:20 }}>Ringkasan</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#94a3b8" }}>Total Transaksi</span>
              <span style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{all.length}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#94a3b8" }}>Pemasukan</span>
              <span style={{ fontSize:16, fontWeight:700, color:"#10b981" }}>{all.filter(t=>t.type==="income").length}x</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#94a3b8" }}>Pengeluaran</span>
              <span style={{ fontSize:16, fontWeight:700, color:"#ef4444" }}>{all.filter(t=>t.type==="expense").length}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Riwayat Transaksi</span>
          <span style={{ fontSize:12, color:"#64748b" }}>{all.length} transaksi</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                {["Deskripsi","Tanggal","Kategori","Tipe","Jumlah",""].map((h) => (
                  <th key={h} style={{ textAlign: h==="Jumlah"?"right":"left", padding:"12px 20px", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map((tx, i) => (
                <tr key={tx.id} style={{ borderBottom: i < all.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background: tx.type==="income"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)" }}>
                        {tx.type==="income" ? <ArrowUpRight style={{ width:14, height:14, color:"#34d399" }} /> : <ArrowDownRight style={{ width:14, height:14, color:"#f87171" }} />}
                      </div>
                      <span style={{ color:"#fff", fontWeight:500 }}>{tx.description}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{formatDate(tx.date)}</td>
                  <td style={{ padding:"12px 20px" }}><span style={{ padding:"3px 8px", borderRadius:6, fontSize:11, background:"rgba(100,116,139,0.1)", color:"#94a3b8" }}>{tx.category}</span></td>
                  <td style={{ padding:"12px 20px" }}><span style={{ padding:"3px 8px", borderRadius:6, fontSize:11, background: tx.type==="income"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)", color: tx.type==="income"?"#34d399":"#f87171" }}>{tx.type==="income"?"Pemasukan":"Pengeluaran"}</span></td>
                  <td style={{ padding:"12px 20px", textAlign:"right", fontWeight:600, color: tx.type==="income"?"#34d399":"#f87171" }}>{tx.type==="income"?"+":"−"}{formatCurrency(tx.amount)}</td>
                  <td style={{ padding:"12px 20px" }}>
                    <button onClick={() => setDeleteId(tx.id)} style={{ width:28, height:28, borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Trash2 style={{ width:12, height:12 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Tambah Transaksi" size="md">
        <form onSubmit={async (e) => { e.preventDefault(); await createTx.mutateAsync(form); setForm(EMPTY); setShowForm(false); }} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={labelStyle}>Tipe</label>
            <div style={{ display:"flex", gap:8 }}>
              {(["income","expense"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setForm({...form,type:t})}
                  style={{ flex:1, padding:"10px 0", borderRadius:10, border:"1px solid", cursor:"pointer", fontSize:13, fontWeight:600, background: form.type===t?(t==="income"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)"):"transparent", color: form.type===t?(t==="income"?"#34d399":"#f87171"):"#94a3b8", borderColor: form.type===t?(t==="income"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"):"rgba(255,255,255,0.06)" }}>
                  {t==="income"?"Pemasukan":"Pengeluaran"}
                </button>
              ))}
            </div>
          </div>
          <div><label style={labelStyle}>Deskripsi *</label><input value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} required style={inputStyle} placeholder="Keterangan" /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Jumlah (Rp) *</label><input type="number" value={form.amount||""} onChange={(e) => setForm({...form,amount:parseInt(e.target.value)||0})} required min={1} style={inputStyle} placeholder="0" /></div>
            <div><label style={labelStyle}>Tanggal *</label><input type="date" value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} required style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Kategori</label><select value={form.category} onChange={(e) => setForm({...form,category:e.target.value})} style={inputStyle}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={createTx.isPending} style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:createTx.isPending?0.6:1 }}><Save style={{ width:14, height:14 }} />{createTx.isPending?"Menyimpan...":"Simpan"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={btnGhost}><X style={{ width:14, height:14 }} />Batal</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Transaksi?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Data transaksi akan dihapus permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteTx.mutateAsync(deleteId); setDeleteId(null); }}} disabled={deleteTx.isPending} style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteTx.isPending?0.6:1 }}>{deleteTx.isPending?"Menghapus...":"Ya, Hapus"}</button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
