"use client";

import { useState } from "react";
import { Download, FileText, Users, Rocket, DollarSign, Package, ClipboardList, CheckCircle2 } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useProker } from "@/hooks/useProker";
import { useTransactions } from "@/hooks/useTransactions";
import { members as seedMembers } from "@/data/members";
import { prokerList as seedProker } from "@/data/proker";
import { transactions as seedTx } from "@/data/finance";
import { inventoryItems } from "@/data/inventory";
import { exportAnggotaPDF, exportAnggotaExcel, exportProkerPDF, exportProkerExcel, exportKeuanganPDF, exportKeuanganExcel, exportInventarisPDF, exportInventarisExcel } from "@/lib/export";
import type { MemberRow, ProkerRow, TransactionRow } from "@/types/database";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };

export default function ExportPage() {
  const { data: dbMembers } = useMembers();
  const { data: dbProker } = useProker();
  const { data: dbTx } = useTransactions();
  const members = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const proker = (dbProker ?? seedProker) as unknown as ProkerRow[];
  const transactions = (dbTx ?? seedTx) as unknown as TransactionRow[];

  const EXPORTS = [
    { title:"Data Anggota", desc:`${members.length} anggota KKN 146`, icon:Users, color:"#10b981", pdfFn:() => exportAnggotaPDF(members), xlFn:() => exportAnggotaExcel(members) },
    { title:"Program Kerja", desc:`${proker.length} program kerja`, icon:Rocket, color:"#8b5cf6", pdfFn:() => exportProkerPDF(proker), xlFn:() => exportProkerExcel(proker) },
    { title:"Laporan Keuangan", desc:`${transactions.length} transaksi`, icon:DollarSign, color:"#06b6d4", pdfFn:() => exportKeuanganPDF(transactions), xlFn:() => exportKeuanganExcel(transactions) },
    { title:"Inventaris", desc:`${inventoryItems.length} item perlengkapan`, icon:Package, color:"#f59e0b", pdfFn:() => exportInventarisPDF(inventoryItems), xlFn:() => exportInventarisExcel(inventoryItems) },
  ];

  return (
    <div style={{ maxWidth:900, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Export Laporan</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Unduh semua laporan KKN 146 dalam format PDF atau Excel</p>
      </div>

      <div style={{ ...card, padding:20, display:"flex", alignItems:"flex-start", gap:12, borderColor:"rgba(16,185,129,0.2)", background:"rgba(16,185,129,0.05)" }}>
        <Download style={{ width:20, height:20, color:"#34d399", flexShrink:0, marginTop:2 }} />
        <div>
          <p style={{ color:"#fff", fontWeight:600, fontSize:14 }}>Semua laporan siap diunduh</p>
          <p style={{ color:"#94a3b8", fontSize:12, marginTop:4, lineHeight:1.6 }}>File akan otomatis terunduh ke folder Downloads. PDF menggunakan desain profesional dengan header KKN 146.</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:16 }} className="max-sm:!grid-cols-1">
        {EXPORTS.map((exp) => (
          <ExportCard key={exp.title} {...exp} />
        ))}
      </div>
    </div>
  );
}

function ExportCard({ title, desc, icon: Icon, color, pdfFn, xlFn }: { title:string; desc:string; icon:typeof Users; color:string; pdfFn:()=>void; xlFn:()=>void }) {
  const [status, setStatus] = useState<"idle"|"pdf"|"xl"|"done">("idle");

  const handlePdf = async () => { setStatus("pdf"); try { await pdfFn(); } catch {} setStatus("done"); setTimeout(()=>setStatus("idle"), 2000); };
  const handleXl = async () => { setStatus("xl"); try { await xlFn(); } catch {} setStatus("done"); setTimeout(()=>setStatus("idle"), 2000); };

  return (
    <div style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`${color}15`, border:`1px solid ${color}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon style={{ width:20, height:20, color }} />
        </div>
        <div>
          <h3 style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{title}</h3>
          <p style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>{desc}</p>
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:16, display:"flex", flexDirection:"column", gap:8 }}>
        <button onClick={handlePdf} disabled={status!=="idle"}
          style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:8, opacity: status!=="idle"?0.6:1 }}>
          {status==="pdf" ? "Mengekspor..." : status==="done" ? <><CheckCircle2 style={{width:14,height:14}} /> Berhasil!</> : <><FileText style={{width:14,height:14}} /> Export PDF</>}
        </button>
        <button onClick={handleXl} disabled={status!=="idle"}
          style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid rgba(16,185,129,0.2)", background:"rgba(16,185,129,0.08)", color:"#34d399", fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:8, opacity: status!=="idle"?0.6:1 }}>
          {status==="xl" ? "Mengekspor..." : status==="done" ? <><CheckCircle2 style={{width:14,height:14}} /> Berhasil!</> : <><FileText style={{width:14,height:14}} /> Export Excel</>}
        </button>
      </div>
    </div>
  );
}
