"use client";

import { useState, useRef } from "react";
import { Users, Search, GraduationCap, Plus, Edit2, Trash2, X, Save, Camera, Upload } from "lucide-react";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "@/hooks/useMembers";
import { members as seedMembers } from "@/data/members";
import { Modal } from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import type { MemberRow } from "@/types/database";
import type { MemberPayload } from "@/hooks/useMembers";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const EMPTY: MemberPayload = { name:"", nim:"", division:"PDD", role:"", faculty:"", prodi:"", gender:"Laki-Laki", quote:"", instagram:"", whatsapp:null, photo_url:null, color:"from-emerald-500 to-teal-600", initials:"" };
const DIVS = ["Ketua","Sekretaris","Bendahara","Humas","Humas & Acara","Acara","PDD"];

async function uploadPhoto(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `members/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) { console.error("Upload error:", error); return null; }
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  return data.publicUrl;
}

function Avatar({ m, size = 48 }: { m: MemberRow; size?: number }) {
  const photoUrl = m.photo_url;
  const initials = (m as any).initials ?? m.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const color = (m as any).color ?? "from-emerald-500 to-cyan-500";

  if (photoUrl) {
    return (
      <div style={{ width:size, height:size, borderRadius:size > 40 ? 16 : 12, overflow:"hidden", flexShrink:0 }}>
        <Image src={photoUrl} alt={m.name} width={size} height={size} style={{ objectFit:"cover", width:"100%", height:"100%" }} />
      </div>
    );
  }
  return (
    <div className={`bg-gradient-to-br ${color}`} style={{ width:size, height:size, borderRadius:size > 40 ? 16 : 12, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:size > 40 ? 18 : 14, flexShrink:0 }}>
      {initials}
    </div>
  );
}

export default function AnggotaPage() {
  const { data: dbMembers } = useMembers();
  const createM = useCreateMember();
  const updateM = useUpdateMember();
  const deleteM = useDeleteMember();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<MemberRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberPayload>(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const all = (dbMembers ?? seedMembers) as unknown as MemberRow[];
  const filtered = all.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.nim.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(EMPTY); setPhotoFile(null); setPhotoPreview(null); setShowForm(true); };
  const openEdit = (m: MemberRow) => {
    setForm({ name:m.name, nim:m.nim, division:m.division, role:m.role, faculty:m.faculty, prodi:m.prodi, gender:m.gender, quote:m.quote??"", instagram:m.instagram??"", whatsapp:m.whatsapp??null, photo_url:m.photo_url??null, color:(m as any).color??"from-emerald-500 to-teal-600", initials:(m as any).initials??"" });
    setPhotoFile(null);
    setPhotoPreview(m.photo_url ?? null);
    setEditTarget(m);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let photoUrl = form.photo_url;
    if (photoFile) {
      const url = await uploadPhoto(photoFile);
      if (url) photoUrl = url;
    }

    const payload = { ...form, photo_url: photoUrl, initials: form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() };
    if (editTarget) { await updateM.mutateAsync({ id: editTarget.id, ...payload }); setEditTarget(null); }
    else { await createM.mutateAsync(payload); setShowForm(false); }
    setUploading(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Anggota KKN 146</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{all.length} anggota terdaftar</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative" }}>
            <Search style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"#475569", pointerEvents:"none" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, NIM..." style={{ ...inputStyle, paddingLeft:36, width:220 }} />
          </div>
          <button onClick={openCreate} style={btnPrimary}><Plus style={{ width:16, height:16 }} /> Tambah</button>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
        {filtered.map((m) => (
          <div key={m.id} style={{ ...card, padding:20, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10 }}>
              <Avatar m={m} size={56} />
              <p style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{m.name}</p>
              <p style={{ color:"#64748b", fontSize:11, fontFamily:"monospace" }}>{m.nim}</p>
              <span style={{ padding:"4px 10px", borderRadius:8, fontSize:10, fontWeight:600, background:"rgba(16,185,129,0.1)", color:"#34d399" }}>{m.division}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#94a3b8" }}>
              <GraduationCap style={{ width:12, height:12, color:"#64748b" }} />{m.prodi}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:"auto", paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <button onClick={() => openEdit(m)} style={{ flex:1, padding:"8px 0", borderRadius:8, border:"none", background:"rgba(255,255,255,0.04)", color:"#94a3b8", fontSize:11, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <Edit2 style={{ width:11, height:11 }} />Edit
              </button>
              <button onClick={() => setDeleteId(m.id)} style={{ padding:"8px 12px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Trash2 style={{ width:12, height:12 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={showForm || !!editTarget} onClose={() => { setShowForm(false); setEditTarget(null); setPhotoFile(null); setPhotoPreview(null); }} title={editTarget ? "Edit Anggota" : "Tambah Anggota"} size="lg">
        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Photo Upload */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              {photoPreview ? (
                <div style={{ width:80, height:80, borderRadius:20, overflow:"hidden", border:"2px solid rgba(16,185,129,0.3)" }}>
                  <img src={photoPreview} alt="Preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ) : (
                <div style={{ width:80, height:80, borderRadius:20, background:"rgba(255,255,255,0.04)", border:"2px dashed rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Camera style={{ width:24, height:24, color:"#64748b" }} />
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ position:"absolute", bottom:-4, right:-4, width:28, height:28, borderRadius:99, background:"linear-gradient(135deg, #10b981, #06b6d4)", border:"3px solid #111b2e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Upload style={{ width:12, height:12, color:"#fff" }} />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            <p style={{ fontSize:11, color:"#64748b" }}>Klik ikon untuk upload foto (opsional)</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Nama Lengkap *</label><input value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required style={inputStyle} placeholder="Nama lengkap" /></div>
            <div><label style={labelStyle}>NIM *</label><input value={form.nim} onChange={(e) => setForm({...form, nim:e.target.value})} required style={inputStyle} placeholder="G1A023039" /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Divisi *</label><select value={form.division} onChange={(e) => setForm({...form, division:e.target.value})} style={inputStyle}>{DIVS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
            <div><label style={labelStyle}>Jabatan *</label><input value={form.role} onChange={(e) => setForm({...form, role:e.target.value})} required style={inputStyle} placeholder="Koordinator PDD" /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Fakultas *</label><input value={form.faculty} onChange={(e) => setForm({...form, faculty:e.target.value})} required style={inputStyle} placeholder="Fakultas Teknik" /></div>
            <div><label style={labelStyle}>Prodi *</label><input value={form.prodi} onChange={(e) => setForm({...form, prodi:e.target.value})} required style={inputStyle} placeholder="Informatika" /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Jenis Kelamin</label><select value={form.gender} onChange={(e) => setForm({...form, gender:e.target.value})} style={inputStyle}><option value="Laki-Laki">Laki-Laki</option><option value="Perempuan">Perempuan</option></select></div>
            <div><label style={labelStyle}>Instagram</label><input value={form.instagram??""} onChange={(e) => setForm({...form, instagram:e.target.value})} style={inputStyle} placeholder="username" /></div>
          </div>
          <div><label style={labelStyle}>Quote</label><input value={form.quote??""} onChange={(e) => setForm({...form, quote:e.target.value})} style={inputStyle} placeholder="Kata motivasi..." /></div>
          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={createM.isPending || updateM.isPending || uploading} style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity: (createM.isPending||updateM.isPending||uploading)?0.6:1 }}>
              <Save style={{ width:14, height:14 }} />{uploading?"Mengupload foto...":(createM.isPending||updateM.isPending)?"Menyimpan...":"Simpan"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); setPhotoFile(null); setPhotoPreview(null); }} style={btnGhost}><X style={{ width:14, height:14 }} />Batal</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Anggota?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Data anggota akan dihapus permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteM.mutateAsync(deleteId); setDeleteId(null); }}} disabled={deleteM.isPending} style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteM.isPending?0.6:1 }}>
            {deleteM.isPending?"Menghapus...":"Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
