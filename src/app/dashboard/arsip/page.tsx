"use client";

import { FolderOpen, FileText, File } from "lucide-react";
import { formatDate } from "@/lib/utils";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };

const FILES = [
  { id:"1", name:"Proposal KKN 146.pdf", category:"Proposal", size:"2.4 MB", date:"2026-05-10", uploader:"Revina" },
  { id:"2", name:"Surat Izin Lokasi.docx", category:"Surat", size:"156 KB", date:"2026-05-12", uploader:"Ping" },
  { id:"3", name:"RAB KKN 146.xlsx", category:"Keuangan", size:"89 KB", date:"2026-05-15", uploader:"Bella" },
  { id:"4", name:"Proker Pendidikan.pdf", category:"Proker", size:"1.2 MB", date:"2026-05-20", uploader:"Hafizah" },
  { id:"5", name:"Absensi Minggu 1.xlsx", category:"Administrasi", size:"45 KB", date:"2026-06-07", uploader:"Revina" },
  { id:"6", name:"LPJ Gotong Royong.pdf", category:"LPJ", size:"890 KB", date:"2026-06-08", uploader:"Danil" },
  { id:"7", name:"Laporan Keuangan.pdf", category:"Keuangan", size:"540 KB", date:"2026-06-08", uploader:"Bella" },
];

export default function ArsipPage() {
  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Arsip Digital</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{FILES.length} dokumen tersimpan</p>
      </div>

      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:10 }}>
          <FolderOpen style={{ width:16, height:16, color:"#34d399" }} />
          <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Semua File</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                {["File","Kategori","Ukuran","Tanggal","Uploader"].map((h) => (
                  <th key={h} style={{ textAlign:"left", padding:"12px 20px", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILES.map((f, i) => (
                <tr key={f.id} style={{ borderBottom: i < FILES.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <FileText style={{ width:16, height:16, color: f.name.endsWith(".pdf")?"#f87171":f.name.endsWith(".xlsx")?"#34d399":"#60a5fa" }} />
                      <span style={{ color:"#fff", fontWeight:500 }}>{f.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 20px" }}><span style={{ padding:"3px 8px", borderRadius:6, fontSize:11, background:"rgba(100,116,139,0.1)", color:"#94a3b8" }}>{f.category}</span></td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{f.size}</td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{formatDate(f.date)}</td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{f.uploader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
