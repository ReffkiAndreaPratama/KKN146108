"use client";

import { useState, useRef } from "react";
import { FolderOpen, FileText, Upload, Trash2, Plus, X, Save, File, Edit2, ExternalLink } from "lucide-react";
import { useArsip, useCreateArsip, useUpdateArsip, useDeleteArsip } from "@/hooks/useArsip";
import { Modal } from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { ArsipRow } from "@/types/database";
import type { ArsipPayload } from "@/hooks/useArsip";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

const CATEGORIES = ["Proposal", "LPJ", "Surat", "Administrasi", "Proker", "Keuangan", "Dokumentasi"];

// Seed hanya tampil saat DB kosong — tidak bisa diedit/dihapus ke DB
const FILES_SEED: ArsipRow[] = [
  { id:"s1", name:"Proposal KKN 146.pdf",   category:"Proposal",     file_url:"#", file_type:"pdf",  size_bytes:2516582, uploader:"Revina", created_at:"2026-05-10T00:00:00Z" },
  { id:"s2", name:"Surat Izin Lokasi.docx", category:"Surat",        file_url:"#", file_type:"docx", size_bytes:159744,  uploader:"Ping",   created_at:"2026-05-12T00:00:00Z" },
  { id:"s3", name:"RAB KKN 146.xlsx",       category:"Keuangan",     file_url:"#", file_type:"xlsx", size_bytes:91136,   uploader:"Bella",  created_at:"2026-05-15T00:00:00Z" },
  { id:"s4", name:"Proker Pendidikan.pdf",  category:"Proker",       file_url:"#", file_type:"pdf",  size_bytes:1258291, uploader:"Hafizah",created_at:"2026-05-20T00:00:00Z" },
  { id:"s5", name:"Absensi Minggu 1.xlsx",  category:"Administrasi", file_url:"#", file_type:"xlsx", size_bytes:46080,   uploader:"Revina", created_at:"2026-06-07T00:00:00Z" },
  { id:"s6", name:"LPJ Gotong Royong.pdf",  category:"LPJ",          file_url:"#", file_type:"pdf",  size_bytes:911360,  uploader:"Danil",  created_at:"2026-06-08T00:00:00Z" },
  { id:"s7", name:"Laporan Keuangan.pdf",   category:"Keuangan",     file_url:"#", file_type:"pdf",  size_bytes:552960,  uploader:"Bella",  created_at:"2026-06-08T00:00:00Z" },
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isSeed = (id: string) => !UUID_REGEX.test(id);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIconColor(type: string): string {
  if (type === "pdf") return "#f87171";
  if (type === "xlsx" || type === "xls") return "#34d399";
  if (type === "docx" || type === "doc") return "#60a5fa";
  return "#94a3b8";
}

function FileIcon({ type }: { type: string }) {
  return <FileText style={{ width:16, height:16, color: fileIconColor(type) }} />;
}

async function uploadFile(file: File): Promise<{ url: string; type: string; size: number } | { error: string }> {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const fileName = `arsip/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(fileName, file, { cacheControl:"3600", upsert:false });
  if (error) return { error: `Upload gagal: ${error.message}` };
  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  return { url: data.publicUrl, type: ext, size: file.size };
}

const EMPTY_FORM = { name:"", category:"Administrasi", uploader:"Admin" };

export default function ArsipPage() {
  const { data: dbFiles } = useArsip();
  const createArsip = useCreateArsip();
  const updateArsip = useUpdateArsip();
  const deleteArsip = useDeleteArsip();

  const dbList: ArsipRow[] = dbFiles ?? [];
  // Tampilkan DB + seed (seed hanya muncul saat DB kosong)
  const [hiddenSeedIds, setHiddenSeedIds] = useState<Set<string>>(new Set());
  const visibleSeeds = FILES_SEED.filter(s => !hiddenSeedIds.has(s.id));
  const files: ArsipRow[] = dbList.length > 0 ? [...dbList, ...visibleSeeds] : visibleSeeds;

  const [showForm,    setShowForm]    = useState(false);
  const [editTarget,  setEditTarget]  = useState<ArsipRow | null>(null);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [saveError,   setSaveError]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setUploadedFile(null);
    setEditTarget(null);
    setSaveError(null);
    setShowForm(true);
  };

  const openEdit = (f: ArsipRow) => {
    setForm({ name: f.name, category: f.category, uploader: f.uploader });
    setUploadedFile(null);
    setEditTarget(f);
    setSaveError(null);
    setShowForm(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!form.name) setForm(f => ({ ...f, name: file.name }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setUploading(true);

    try {
      if (editTarget && !isSeed(editTarget.id)) {
        // Edit DB item — file opsional (bisa ganti file atau hanya update metadata)
        let fileUrl = editTarget.file_url;
        let fileType = editTarget.file_type;
        let sizeBytes = editTarget.size_bytes;

        if (uploadedFile) {
          const res = await uploadFile(uploadedFile);
          if ("error" in res) { setSaveError(res.error); setUploading(false); return; }
          fileUrl = res.url; fileType = res.type; sizeBytes = res.size;
        }
        await updateArsip.mutateAsync({
          id: editTarget.id,
          name: form.name,
          category: form.category,
          uploader: form.uploader,
          file_url: fileUrl,
          file_type: fileType,
          size_bytes: sizeBytes,
        });
      } else {
        // Create baru (atau seed di-edit → insert ke DB)
        if (!uploadedFile && !(editTarget && isSeed(editTarget.id))) {
          setSaveError("Pilih file terlebih dahulu.");
          setUploading(false);
          return;
        }

        let fileUrl = "#";
        let fileType = "pdf";
        let sizeBytes = 0;

        if (uploadedFile) {
          const res = await uploadFile(uploadedFile);
          if ("error" in res) { setSaveError(res.error); setUploading(false); return; }
          fileUrl = res.url; fileType = res.type; sizeBytes = res.size;
        } else if (editTarget && isSeed(editTarget.id)) {
          // Edit seed tanpa ganti file — pakai data seed
          fileUrl = editTarget.file_url;
          fileType = editTarget.file_type;
          sizeBytes = editTarget.size_bytes;
        }

        const payload: ArsipPayload = {
          name: form.name,
          category: form.category,
          file_url: fileUrl,
          file_type: fileType,
          size_bytes: sizeBytes,
          uploader: form.uploader,
        };
        await createArsip.mutateAsync(payload);

        // Sembunyikan seed yang sudah di-replace
        if (editTarget && isSeed(editTarget.id)) {
          setHiddenSeedIds(prev => new Set([...prev, editTarget.id]));
        }
      }

      setShowForm(false);
      setEditTarget(null);
      setUploadedFile(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSaveError(`Gagal menyimpan: ${msg}`);
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (isSeed(deleteId)) {
      setHiddenSeedIds(prev => new Set([...prev, deleteId]));
      setDeleteId(null);
    } else {
      await deleteArsip.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const isBusy = uploading || createArsip.isPending || updateArsip.isPending;

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Arsip Digital</h1>
          <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{files.length} dokumen tersimpan</p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>
          <Plus style={{ width:16, height:16 }} /> Upload File
        </button>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:10 }}>
          <FolderOpen style={{ width:16, height:16, color:"#34d399" }} />
          <span style={{ fontSize:14, fontWeight:600, color:"#fff" }}>Semua File</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                {["File","Kategori","Ukuran","Tanggal","Uploader","Aksi"].map((h) => (
                  <th key={h} style={{ textAlign:"left", padding:"12px 20px", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={f.id} style={{ borderBottom: i < files.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <FileIcon type={f.file_type} />
                      {f.file_url && f.file_url !== "#" ? (
                        <a href={f.file_url} target="_blank" rel="noreferrer"
                          style={{ color:"#fff", fontWeight:500, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}
                          onMouseEnter={e => (e.currentTarget.style.color="#34d399")}
                          onMouseLeave={e => (e.currentTarget.style.color="#fff")}>
                          {f.name}
                          <ExternalLink style={{ width:11, height:11, opacity:0.5, flexShrink:0 }} />
                        </a>
                      ) : (
                        <span style={{ color:"#64748b", fontWeight:500 }}>{f.name}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding:"12px 20px" }}>
                    <span style={{ padding:"3px 8px", borderRadius:6, fontSize:11, background:"rgba(100,116,139,0.1)", color:"#94a3b8" }}>{f.category}</span>
                  </td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8", whiteSpace:"nowrap" }}>{formatBytes(f.size_bytes)}</td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8", whiteSpace:"nowrap" }}>
                    {f.created_at ? formatDate(f.created_at.split("T")[0]) : "-"}
                  </td>
                  <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{f.uploader}</td>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => openEdit(f)}
                        style={{ padding:"6px 10px", borderRadius:8, border:"none", background:"rgba(255,255,255,0.04)", color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:11 }}>
                        <Edit2 style={{ width:12, height:12 }} /> Edit
                      </button>
                      <button onClick={() => setDeleteId(f.id)}
                        style={{ padding:"6px 10px", borderRadius:8, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:11 }}>
                        <Trash2 style={{ width:12, height:12 }} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {files.length === 0 && (
          <div style={{ padding:48, textAlign:"center" }}>
            <FolderOpen style={{ width:32, height:32, color:"#334155", margin:"0 auto 12px" }} />
            <p style={{ color:"#475569", fontSize:14 }}>Belum ada file. Klik Upload File untuk menambahkan.</p>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditTarget(null); setUploadedFile(null); setForm(EMPTY_FORM); setSaveError(null); }}
        title={editTarget ? "Edit File" : "Upload File"} size="md">
        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {saveError && (
            <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, color:"#f87171", fontSize:12 }}>
              ⚠️ {saveError}
            </div>
          )}

          {/* File Upload Zone */}
          <div onClick={() => fileRef.current?.click()}
            style={{ border:"2px dashed rgba(255,255,255,0.12)", borderRadius:12, padding:24, textAlign:"center", cursor:"pointer", background:"rgba(255,255,255,0.02)", transition:"border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
            {uploadedFile ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <File style={{ width:20, height:20, color:"#34d399" }} />
                <span style={{ color:"#fff", fontSize:13, fontWeight:500 }}>{uploadedFile.name}</span>
                <span style={{ color:"#64748b", fontSize:11 }}>({formatBytes(uploadedFile.size)})</span>
              </div>
            ) : editTarget && !isSeed(editTarget.id) ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <FileIcon type={editTarget.file_type} />
                <span style={{ color:"#94a3b8", fontSize:13 }}>{editTarget.name}</span>
                <span style={{ color:"#475569", fontSize:11 }}>(klik untuk ganti file)</span>
              </div>
            ) : (
              <>
                <Upload style={{ width:24, height:24, color:"#64748b", margin:"0 auto 8px" }} />
                <p style={{ color:"#94a3b8", fontSize:13 }}>Klik untuk pilih file</p>
                <p style={{ color:"#475569", fontSize:11, marginTop:4 }}>PDF, DOCX, XLSX, dll.</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" onChange={handleFileSelect} style={{ display:"none" }} />

          <div>
            <label style={labelStyle}>Nama File *</label>
            <input value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required style={inputStyle} placeholder="Nama dokumen..." />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select value={form.category} onChange={(e) => setForm({...form, category:e.target.value})} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Uploader</label>
              <input value={form.uploader} onChange={(e) => setForm({...form, uploader:e.target.value})} style={inputStyle} placeholder="Nama uploader" />
            </div>
          </div>

          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={isBusy}
              style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:isBusy?0.5:1 }}>
              <Save style={{ width:14, height:14 }} />
              {uploading ? "Mengupload..." : isBusy ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Upload & Simpan"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); setUploadedFile(null); setForm(EMPTY_FORM); setSaveError(null); }} style={btnGhost}>
              <X style={{ width:14, height:14 }} /> Batal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus File?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>
          {deleteId && isSeed(deleteId)
            ? "File contoh ini akan disembunyikan dari tampilan."
            : "File ini akan dihapus secara permanen dari database."}
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={handleDelete} disabled={deleteArsip.isPending}
            style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteArsip.isPending?0.6:1 }}>
            {deleteArsip.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
