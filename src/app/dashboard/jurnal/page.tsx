"use client";

import { useState } from "react";
import { BookOpen, Tag, Calendar, Plus, Trash2, X, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useJournal, useCreateJournal, useDeleteJournal } from "@/hooks/useJournal";
import { Modal } from "@/components/ui/Modal";
import type { JournalRow } from "@/types/database";
import type { JournalPayload } from "@/hooks/useJournal";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const SEED: JournalRow[] = [
  { id:"1", date:"2026-06-07", title:"Gotong Royong Perdana", content:"Hari ini kami melaksanakan gotong royong bersama warga desa. Antusias warga sangat tinggi.", priority:"high", tags:["gotong royong","lingkungan"], author:"Ping", created_at:"" },
  { id:"2", date:"2026-06-06", title:"Rapat Koordinasi Proker", content:"Rapat membahas progress program kerja minggu pertama. Semua proker berjalan sesuai rencana.", priority:"medium", tags:["rapat","koordinasi"], author:"Revina", created_at:"" },
  { id:"3", date:"2026-06-05", title:"Kunjungan ke Sekolah SD", content:"Survei ke SDN Talang Marap untuk persiapan program bimbel. Kepala sekolah sangat mendukung.", priority:"medium", tags:["pendidikan","survei"], author:"Hafizah", created_at:"" },
  { id:"4", date:"2026-06-04", title:"Persiapan Spanduk & Atribut", content:"Spanduk KKN sudah terpasang di posko dan balai desa. Atribut tim sudah lengkap.", priority:"low", tags:["persiapan"], author:"Reffki", created_at:"" },
  { id:"5", date:"2026-06-03", title:"Perkenalan dengan Warga", content:"Hari pertama di desa. Melakukan perkenalan dengan perangkat desa dan warga sekitar posko.", priority:"medium", tags:["perkenalan","warga"], author:"Ping", created_at:"" },
];

const priorityColors: Record<string,string> = { high:"#f87171", medium:"#fbbf24", low:"#94a3b8" };
const priorityLabels: Record<string,string> = { high:"Tinggi", medium:"Sedang", low:"Rendah" };
const EMPTY: JournalPayload = { date:new Date().toISOString().split("T")[0], title:"", content:"", priority:"medium", tags:[], author:"" };

export default function JurnalPage() {
  const { data: dbEntries } = useJournal();
  const createJ = useCreateJournal();
  const deleteJ = useDeleteJournal();

  const entries: JournalRow[] = dbEntries ?? SEED;
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<JournalPayload>(EMPTY);
  const [tagsInput, setTagsInput] = useState("");
  return (
    <div style={{ maxWidth:800, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Jurnal Harian</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{entries.length} catatan kegiatan</p>
        </div>
        <button onClick={() => setShowForm(true)} style={btnPrimary}><Plus style={{ width:16, height:16 }} /> Tambah Catatan</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {entries.map((entry) => (
          <div key={entry.id} style={{ ...card, padding:24 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12 }}>
              <h3 style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{entry.title}</h3>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <span style={{ padding:"3px 10px", borderRadius:8, fontSize:10, fontWeight:600, color:priorityColors[entry.priority], background:`${priorityColors[entry.priority]}15` }}>
                  {priorityLabels[entry.priority]}
                </span>
                <button onClick={() => setDeleteId(entry.id)} style={{ width:28, height:28, borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Trash2 style={{ width:12, height:12 }} />
                </button>
              </div>
            </div>
            <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.7, marginBottom:16 }}>{entry.content}</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {entry.tags.map((tag) => (
                  <span key={tag} style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)", color:"#94a3b8", fontSize:11 }}>
                    <Tag style={{ width:10, height:10 }} />{tag}
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"#64748b", fontSize:12 }}>
                <Calendar style={{ width:12, height:12 }} />
                <span>{formatDate(entry.date)}</span>
                <span>· {entry.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Catatan Baru" size="md">
        <form onSubmit={async (e) => { e.preventDefault(); await createJ.mutateAsync({ ...form, tags: tagsInput.split(",").map(t=>t.trim()).filter(Boolean) }); setForm(EMPTY); setTagsInput(""); setShowForm(false); }} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Tanggal *</label><input type="date" value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Prioritas</label><select value={form.priority} onChange={(e) => setForm({...form,priority:e.target.value as any})} style={inputStyle}><option value="low">Rendah</option><option value="medium">Sedang</option><option value="high">Tinggi</option></select></div>
          </div>
          <div><label style={labelStyle}>Judul *</label><input value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} required style={inputStyle} placeholder="Judul catatan" /></div>
          <div><label style={labelStyle}>Isi Catatan *</label><textarea value={form.content} onChange={(e) => setForm({...form,content:e.target.value})} required rows={4} style={{ ...inputStyle, resize:"none" }} placeholder="Ceritakan kegiatan hari ini..." /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Penulis</label><input value={form.author} onChange={(e) => setForm({...form,author:e.target.value})} style={inputStyle} placeholder="Nama" /></div>
            <div><label style={labelStyle}>Tags (pisah koma)</label><input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} style={inputStyle} placeholder="rapat, kegiatan" /></div>
          </div>
          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={createJ.isPending} style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:createJ.isPending?0.6:1 }}><Save style={{ width:14, height:14 }} />{createJ.isPending?"Menyimpan...":"Simpan"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={btnGhost}><X style={{ width:14, height:14 }} />Batal</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Catatan?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Catatan akan dihapus permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteJ.mutateAsync(deleteId); setDeleteId(null); }}} disabled={deleteJ.isPending} style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteJ.isPending?0.6:1 }}>{deleteJ.isPending?"Menghapus...":"Ya, Hapus"}</button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
