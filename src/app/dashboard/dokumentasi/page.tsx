"use client";

import { useState, useRef } from "react";
import { Camera, Plus, Edit2, Trash2, X, Save, Upload, ImageIcon } from "lucide-react";
import { useDokumentasi, useCreateDokumentasi, useUpdateDokumentasi, useDeleteDokumentasi } from "@/hooks/useDokumentasi";
import { Modal } from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { DokumentasiRow } from "@/types/database";
import type { DokumentasiPayload } from "@/hooks/useDokumentasi";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const CATEGORIES = ["Survey", "Rapat", "Kegiatan", "Gotong Royong", "Pendidikan", "Sosialisasi"];

const CAT_COLORS: Record<string, string> = {
  Survey: "rgba(16,185,129,0.15)",
  Rapat: "rgba(6,182,212,0.15)",
  Kegiatan: "rgba(139,92,246,0.15)",
  "Gotong Royong": "rgba(245,158,11,0.15)",
  Pendidikan: "rgba(236,72,153,0.15)",
  Sosialisasi: "rgba(239,68,68,0.15)",
};

const CAT_TEXT: Record<string, string> = {
  Survey: "#34d399",
  Rapat: "#22d3ee",
  Kegiatan: "#a78bfa",
  "Gotong Royong": "#fbbf24",
  Pendidikan: "#f472b6",
  Sosialisasi: "#f87171",
};

// Fallback seed data (emoji placeholders — shown when DB is empty)
const ITEMS_SEED = [
  { id:"1", title:"Survey Lokasi KKN",     category:"Survey",        date:"2026-05-14", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"2", title:"Rapat Koordinasi Tim",   category:"Rapat",         date:"2026-05-16", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"3", title:"Penerimaan di Desa",     category:"Kegiatan",      date:"2026-05-29", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"4", title:"Gotong Royong Desa",     category:"Gotong Royong", date:"2026-06-07", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"5", title:"Bimbel Anak SD",         category:"Pendidikan",    date:"2026-06-01", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"6", title:"Sosialisasi Kesehatan",  category:"Sosialisasi",   date:"2026-06-10", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"7", title:"Pelatihan UMKM",         category:"Kegiatan",      date:"2026-06-05", photo_url:"", description:null, uploader:"Admin", created_at:"" },
  { id:"8", title:"Pengajian Rutin",        category:"Kegiatan",      date:"2026-06-03", photo_url:"", description:null, uploader:"Admin", created_at:"" },
] as DokumentasiRow[];

const EMPTY_FORM: DokumentasiPayload = { title:"", category:"Kegiatan", date:"", photo_url:"", description:"", uploader:"Admin" };

async function uploadPhoto(file: File, folder = "dokumentasi"): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(fileName, file, { cacheControl:"3600", upsert:false });
  if (error) {
    console.error("Upload error:", error);
    // Bucket tidak ada
    if (error.message?.includes("Bucket not found") || (error as { statusCode?: string }).statusCode === "404") {
      return { url: null, error: 'Storage bucket "photos" belum dibuat. Buka Supabase Dashboard → Storage → New Bucket → nama: "photos", centang Public.' };
    }
    return { url: null, error: `Upload gagal: ${error.message}` };
  }
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export default function DokumentasiDashboardPage() {
  const { data: dbItems } = useDokumentasi();
  const createDoc  = useCreateDokumentasi();
  const updateDoc  = useUpdateDokumentasi();
  const deleteDoc  = useDeleteDokumentasi();

  const items: DokumentasiRow[] = (dbItems && dbItems.length > 0) ? dbItems : ITEMS_SEED;

  const [activeCat, setActiveCat] = useState("Semua");
  const [showForm,  setShowForm]  = useState(false);
  const [editTarget, setEditTarget] = useState<DokumentasiRow | null>(null);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [form, setForm]           = useState<DokumentasiPayload>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const allCats = ["Semua", ...CATEGORIES];
  const filtered = activeCat === "Semua" ? items : items.filter((i) => i.category === activeCat);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditTarget(null);
    setUploadError(null);
    setShowForm(true);
  };

  const openEdit = (item: DokumentasiRow) => {
    setForm({ title:item.title, category:item.category, date:item.date, photo_url:item.photo_url, description:item.description??"", uploader:item.uploader });
    setPhotoFile(null);
    setPhotoPreview(item.photo_url || null);
    setEditTarget(item);
    setUploadError(null);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    let photoUrl = form.photo_url;
    if (photoFile) {
      const { url, error: uploadErr } = await uploadPhoto(photoFile, "dokumentasi");
      if (uploadErr) {
        setUploadError(uploadErr);
        setUploading(false);
        return;
      }
      if (url) photoUrl = url;
    }
    const payload: DokumentasiPayload = { ...form, photo_url: photoUrl };
    try {
      if (editTarget) {
        await updateDoc.mutateAsync({ id: editTarget.id, ...payload });
      } else {
        await createDoc.mutateAsync(payload);
      }
      setShowForm(false);
      setEditTarget(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadError(null);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(`Gagal menyimpan: ${msg}`);
    }
    setUploading(false);
  };

  const isBusy = uploading || createDoc.isPending || updateDoc.isPending;

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Dokumentasi</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{items.length} foto kegiatan</p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>
          <Plus style={{ width:16, height:16 }} /> Tambah Foto
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {allCats.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)}
            style={{ padding:"8px 16px", borderRadius:99, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: activeCat===c?"rgba(255,255,255,0.1)":"transparent", color: activeCat===c?"#fff":"#94a3b8", borderColor: activeCat===c?"rgba(255,255,255,0.2)":"transparent" }}>
            {c} {c === "Semua" ? `(${items.length})` : `(${items.filter(i=>i.category===c).length})`}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
        {filtered.map((item) => (
          <div key={item.id} style={{ ...card, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {/* Photo */}
            <div style={{ width:"100%", aspectRatio:"16/9", background:"rgba(255,255,255,0.04)", overflow:"hidden", position:"relative", flexShrink:0 }}>
              {item.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photo_url} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background: CAT_COLORS[item.category] ?? "rgba(255,255,255,0.04)" }}>
                  <ImageIcon style={{ width:32, height:32, color:"rgba(255,255,255,0.2)" }} />
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ padding:14, flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <p style={{ color:"#fff", fontWeight:600, fontSize:13, lineHeight:1.4 }}>{item.title}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ padding:"3px 8px", borderRadius:6, fontSize:10, fontWeight:600, background: CAT_COLORS[item.category] ?? "rgba(100,116,139,0.1)", color: CAT_TEXT[item.category] ?? "#94a3b8" }}>{item.category}</span>
                <span style={{ fontSize:11, color:"#64748b" }}>{item.date ? formatDate(item.date) : ""}</span>
              </div>
              {/* Actions */}
              <div style={{ display:"flex", gap:6, marginTop:"auto", paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                <button onClick={() => openEdit(item)}
                  style={{ flex:1, padding:"7px 0", borderRadius:8, border:"none", background:"rgba(255,255,255,0.04)", color:"#94a3b8", fontSize:11, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <Edit2 style={{ width:11, height:11 }} /> Edit
                </button>
                <button onClick={() => setDeleteId(item.id)}
                  style={{ padding:"7px 12px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Trash2 style={{ width:12, height:12 }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...card, padding:48, textAlign:"center" }}>
          <Camera style={{ width:32, height:32, color:"#334155", margin:"0 auto 12px" }} />
          <p style={{ color:"#475569", fontSize:14 }}>Belum ada foto untuk kategori ini.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditTarget(null); setPhotoFile(null); setPhotoPreview(null); setUploadError(null); }}
        title={editTarget ? "Edit Dokumentasi" : "Tambah Dokumentasi"} size="lg">
        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Error banner */}
          {uploadError && (
            <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, color:"#f87171", fontSize:12, lineHeight:1.5 }}>
              ⚠️ {uploadError}
            </div>
          )}
          {/* Photo Upload */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <div style={{ width:160, height:100, borderRadius:12, overflow:"hidden", border:"2px solid rgba(16,185,129,0.3)" }}>
                  <img src={photoPreview} alt="Preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ) : (
                <div style={{ width:160, height:100, borderRadius:12, background:"rgba(255,255,255,0.04)", border:"2px dashed rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Camera style={{ width:24, height:24, color:"#64748b" }} />
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ position:"absolute", bottom:-6, right:-6, width:28, height:28, borderRadius:99, background:"linear-gradient(135deg, #10b981, #06b6d4)", border:"3px solid #0f1a2e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Upload style={{ width:12, height:12, color:"#fff" }} />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            <p style={{ fontSize:11, color:"#64748b" }}>Klik ikon untuk upload foto</p>
          </div>

          <div>
            <label style={labelStyle}>Judul *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} required style={inputStyle} placeholder="Judul kegiatan..." />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select value={form.category} onChange={(e) => setForm({...form, category:e.target.value})} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tanggal *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({...form, date:e.target.value})} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea value={form.description??""} onChange={(e) => setForm({...form, description:e.target.value})}
              style={{ ...inputStyle, resize:"vertical", minHeight:72 }} placeholder="Deskripsi singkat kegiatan..." />
          </div>

          <div>
            <label style={labelStyle}>Uploader</label>
            <input value={form.uploader} onChange={(e) => setForm({...form, uploader:e.target.value})} style={inputStyle} placeholder="Nama uploader" />
          </div>

          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={isBusy}
              style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:isBusy?0.6:1 }}>
              <Save style={{ width:14, height:14 }} />
              {uploading ? "Mengupload foto..." : isBusy ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); setPhotoFile(null); setPhotoPreview(null); setUploadError(null); }} style={btnGhost}>
              <X style={{ width:14, height:14 }} /> Batal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Foto?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Foto ini akan dihapus secara permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteDoc.mutateAsync(deleteId); setDeleteId(null); }}}
            disabled={deleteDoc.isPending}
            style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteDoc.isPending?0.6:1 }}>
            {deleteDoc.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
