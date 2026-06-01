"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, Clock, AlertCircle, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useProker, useCreateProker, useUpdateProker, useDeleteProker } from "@/hooks/useProker";
import { prokerList as seedProker } from "@/data/proker";
import { Modal } from "@/components/ui/Modal";
import type { ProkerRow } from "@/types/database";
import type { ProkerPayload } from "@/hooks/useProker";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const CAT_LABELS: Record<string,string> = { pendidikan:"Pendidikan", sosial:"Sosial", teknologi:"Teknologi", lingkungan:"Lingkungan", umkm:"UMKM", kesehatan:"Kesehatan", keagamaan:"Keagamaan", administrasi:"Administrasi" };
const STATUS_CFG = { planning:{label:"Planning",icon:AlertCircle,color:"#f59e0b"}, ongoing:{label:"Ongoing",icon:Clock,color:"#06b6d4"}, completed:{label:"Completed",icon:CheckCircle2,color:"#10b981"} };
const EMPTY: ProkerPayload = { name:"", description:"", category:"pendidikan", ketua_pelaksana:"", anggota:[], start_date:"", end_date:"", target:"", progress:0, status:"planning" };

export default function ProkerPage() {
  const { data: dbProker } = useProker();
  const createP = useCreateProker();
  const updateP = useUpdateProker();
  const deleteP = useDeleteProker();

  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ProkerRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProkerPayload>(EMPTY);

  const all = (dbProker ?? seedProker) as unknown as ProkerRow[];
  const filtered = filter === "all" ? all : all.filter((p) => p.status === filter);
  const avg = all.length ? Math.round(all.reduce((a, p) => a + p.progress, 0) / all.length) : 0;

  const openCreate = () => { setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: ProkerRow) => { setForm({ name:p.name, description:p.description, category:p.category, ketua_pelaksana:p.ketua_pelaksana, anggota:p.anggota, start_date:p.start_date, end_date:p.end_date, target:p.target, progress:p.progress, status:p.status }); setEditTarget(p); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) { await updateP.mutateAsync({ id:editTarget.id, ...form }); setEditTarget(null); }
    else { await createP.mutateAsync(form); setShowForm(false); }
  };

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Program Kerja</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{all.length} program kerja · Progress {avg}%</p>
        </div>
        <button onClick={openCreate} style={btnPrimary}><Plus style={{ width:16, height:16 }} /> Tambah Proker</button>
      </div>

      {/* Status Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }} className="max-sm:!grid-cols-1">
        {(["planning","ongoing","completed"] as const).map((s) => {
          const cfg = STATUS_CFG[s]; const count = all.filter((p) => p.status === s).length;
          return (
            <div key={s} onClick={() => setFilter(filter===s?"all":s)} style={{ ...card, padding:20, display:"flex", alignItems:"center", gap:12, cursor:"pointer", borderColor: filter===s?`${cfg.color}40`:`${cfg.color}30`, background:`${cfg.color}08` }}>
              <cfg.icon style={{ width:20, height:20, color:cfg.color }} />
              <div><p style={{ color:"#fff", fontWeight:700, fontSize:20 }}>{count}</p><p style={{ color:cfg.color, fontSize:12, fontWeight:600 }}>{cfg.label}</p></div>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
        {filtered.map((p) => {
          const cfg = STATUS_CFG[p.status];
          return (
            <div key={p.id} style={{ ...card, padding:20, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ padding:"3px 10px", borderRadius:8, fontSize:10, fontWeight:600, background:"rgba(6,182,212,0.1)", color:"#22d3ee" }}>{CAT_LABELS[p.category]??p.category}</span>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:cfg.color }}><cfg.icon style={{ width:12, height:12 }} />{cfg.label}</span>
              </div>
              <h3 style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{p.name}</h3>
              <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.6, flex:1 }}>{p.description}</p>
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:6 }}>
                  <span style={{ color:"#64748b" }}>{p.ketua_pelaksana}</span>
                  <span style={{ color:"#fff", fontWeight:700 }}>{p.progress}%</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${p.progress}%`, background:cfg.color, borderRadius:99 }} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8, paddingTop:8 }}>
                <button onClick={() => openEdit(p)} style={{ flex:1, padding:"7px 0", borderRadius:8, border:"none", background:"rgba(255,255,255,0.04)", color:"#94a3b8", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}><Edit2 style={{ width:11, height:11 }} />Edit</button>
                <button onClick={() => setDeleteId(p.id)} style={{ padding:"7px 12px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer" }}><Trash2 style={{ width:12, height:12 }} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={showForm || !!editTarget} onClose={() => { setShowForm(false); setEditTarget(null); }} title={editTarget?"Edit Program Kerja":"Tambah Program Kerja"} size="lg">
        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={labelStyle}>Nama Proker *</label><input value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required style={inputStyle} placeholder="Bimbingan Belajar Anak SD" /></div>
          <div><label style={labelStyle}>Deskripsi *</label><textarea value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} required rows={3} style={{ ...inputStyle, resize:"none" }} placeholder="Deskripsi program kerja..." /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Kategori</label><select value={form.category} onChange={(e) => setForm({...form,category:e.target.value})} style={inputStyle}>{Object.entries(CAT_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
            <div><label style={labelStyle}>Status</label><select value={form.status} onChange={(e) => setForm({...form,status:e.target.value as any})} style={inputStyle}><option value="planning">Planning</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Ketua Pelaksana *</label><input value={form.ketua_pelaksana} onChange={(e) => setForm({...form,ketua_pelaksana:e.target.value})} required style={inputStyle} placeholder="Nama" /></div>
            <div><label style={labelStyle}>Target</label><input value={form.target} onChange={(e) => setForm({...form,target:e.target.value})} style={inputStyle} placeholder="30 siswa SD" /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Tanggal Mulai *</label><input type="date" value={form.start_date} onChange={(e) => setForm({...form,start_date:e.target.value})} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Tanggal Selesai *</label><input type="date" value={form.end_date} onChange={(e) => setForm({...form,end_date:e.target.value})} required style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Progress: {form.progress}%</label><input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({...form,progress:parseInt(e.target.value)})} style={{ width:"100%" }} /></div>
          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={createP.isPending||updateP.isPending} style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:(createP.isPending||updateP.isPending)?0.6:1 }}><Save style={{ width:14, height:14 }} />{(createP.isPending||updateP.isPending)?"Menyimpan...":"Simpan"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); }} style={btnGhost}><X style={{ width:14, height:14 }} />Batal</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Program Kerja?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Data program kerja akan dihapus permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteP.mutateAsync(deleteId); setDeleteId(null); }}} disabled={deleteP.isPending} style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteP.isPending?0.6:1 }}>{deleteP.isPending?"Menghapus...":"Ya, Hapus"}</button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
