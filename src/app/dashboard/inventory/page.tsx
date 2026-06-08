"use client";

import { useState } from "react";
import { Package, CheckCircle2, AlertCircle, XCircle, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { useInventaris, useCreateInventaris, useUpdateInventaris, useDeleteInventaris } from "@/hooks/useInventaris";
import { inventoryItems } from "@/data/inventory";
import { Modal } from "@/components/ui/Modal";
import type { InventarisRow } from "@/types/database";
import type { InventarisPayload } from "@/hooks/useInventaris";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" };
const labelStyle: React.CSSProperties = { display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:6 };
const btnPrimary: React.CSSProperties = { padding:"10px 18px", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:600, fontSize:13, borderRadius:10, border:"none", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnGhost: React.CSSProperties = { padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.06)", color:"#94a3b8", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };
const btnDanger: React.CSSProperties = { padding:"10px 18px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", fontWeight:600, fontSize:13, borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 };

type CategoryKey = "dapur" | "kebersihan" | "sekretariat" | "p3k" | "pribadi";

const catConfig: Record<CategoryKey, { label:string; emoji:string }> = {
  dapur:      { label:"Dapur",            emoji:"🍳" },
  kebersihan: { label:"Kebersihan",       emoji:"🧹" },
  sekretariat:{ label:"Sekretariat",      emoji:"📋" },
  p3k:        { label:"P3K",             emoji:"🏥" },
  pribadi:    { label:"Kebutuhan Pribadi",emoji:"👤" },
};

const statusConfig = {
  tersedia:  { icon:CheckCircle2, color:"#34d399", label:"Tersedia" },
  kurang:    { icon:AlertCircle,  color:"#fbbf24", label:"Kurang" },
  tidak_ada: { icon:XCircle,     color:"#f87171", label:"Tidak Ada" },
};

const CAT_KEYS = Object.keys(catConfig) as CategoryKey[];

// Convert local seed into InventarisRow shape for fallback display
const SEED_ROWS: InventarisRow[] = inventoryItems.map(item => ({
  id: item.id,
  name: item.name,
  category: item.category,
  quantity: item.quantity,
  unit: item.unit,
  owner: item.owner ?? null,
  status: item.status,
  checked: item.checked,
  created_at: "",
  updated_at: "",
}));

const EMPTY_FORM: InventarisPayload = { name:"", category:"sekretariat", quantity:1, unit:"buah", owner:"", status:"tersedia", checked:false };

export default function InventoryPage() {
  const { data: dbItems } = useInventaris();
  const createInv  = useCreateInventaris();
  const updateInv  = useUpdateInventaris();
  const deleteInv  = useDeleteInventaris();

  // Whether we're using DB data or local seed
  const usingDB = !!(dbItems && dbItems.length > 0);
  const dbRows  = usingDB ? dbItems : SEED_ROWS;

  // Local checked state for seed fallback (DB updates itself via mutation)
  const [localChecked, setLocalChecked] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    SEED_ROWS.forEach(r => { map[r.id] = r.checked; });
    return map;
  });

  const [activeCat, setActiveCat] = useState<CategoryKey | "all">("all");
  const [showForm,  setShowForm]  = useState(false);
  const [editTarget, setEditTarget] = useState<InventarisRow | null>(null);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [form, setForm]           = useState<InventarisPayload>(EMPTY_FORM);

  // Merge checked state for seed rows
  const items: InventarisRow[] = usingDB
    ? dbRows
    : dbRows.map(r => ({ ...r, checked: localChecked[r.id] ?? r.checked }));

  const filtered = activeCat === "all" ? items : items.filter(i => i.category === activeCat);
  const checkedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  const toggleCheck = async (item: InventarisRow) => {
    if (usingDB) {
      await updateInv.mutateAsync({ id: item.id, name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, owner: item.owner, status: item.status, checked: !item.checked });
    } else {
      setLocalChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }));
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setShowForm(true);
  };

  const openEdit = (item: InventarisRow) => {
    setForm({ name:item.name, category:item.category as CategoryKey, quantity:item.quantity, unit:item.unit, owner:item.owner??"", status:item.status, checked:item.checked });
    setEditTarget(item);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: InventarisPayload = { ...form, owner: form.owner || null };
    try {
      if (editTarget) {
        await updateInv.mutateAsync({ id: editTarget.id, ...payload });
      } else {
        await createInv.mutateAsync(payload);
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const isBusy = createInv.isPending || updateInv.isPending;

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Inventaris & Checklist</h1>
            <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Kelola perlengkapan KKN 146</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            {/* Progress */}
            <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:99, padding:"8px 16px" }}>
              <Package style={{ width:16, height:16, color:"#34d399" }} />
              <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{checkedCount}/{items.length}</span>
              <div style={{ width:80, height:6, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(to right, #10b981, #06b6d4)", borderRadius:99, transition:"width 0.3s" }} />
              </div>
              <span style={{ color:"#34d399", fontSize:13, fontWeight:700 }}>{progress}%</span>
            </div>
            <button onClick={openCreate} style={btnPrimary}>
              <Plus style={{ width:16, height:16 }} /> Tambah Item
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        <button onClick={() => setActiveCat("all")}
          style={{ padding:"8px 16px", borderRadius:12, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: activeCat==="all"?"rgba(255,255,255,0.1)":"transparent", color: activeCat==="all"?"#fff":"#94a3b8", borderColor: activeCat==="all"?"rgba(255,255,255,0.2)":"transparent" }}>
          Semua ({items.length})
        </button>
        {CAT_KEYS.map(key => {
          const count = items.filter(i => i.category === key).length;
          return (
            <button key={key} onClick={() => setActiveCat(key)}
              style={{ padding:"8px 16px", borderRadius:12, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: activeCat===key?"rgba(16,185,129,0.1)":"transparent", color: activeCat===key?"#34d399":"#94a3b8", borderColor: activeCat===key?"rgba(16,185,129,0.2)":"transparent" }}>
              {catConfig[key].emoji} {catConfig[key].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                {["✓","Item","Kategori","Jumlah","Pemilik","Status","Aksi"].map((h) => (
                  <th key={h} style={{ textAlign:"left", padding:"12px 20px", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const status = statusConfig[item.status];
                const cat = catConfig[item.category as CategoryKey] ?? { emoji:"📦", label: item.category };
                return (
                  <tr key={item.id} style={{ borderBottom: i < filtered.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: item.checked ? "rgba(16,185,129,0.03)" : "transparent" }}>
                    <td style={{ padding:"12px 20px" }}>
                      <button onClick={() => toggleCheck(item)}
                        style={{ width:20, height:20, borderRadius:6, border: item.checked ? "none" : "2px solid rgba(255,255,255,0.15)", background: item.checked ? "#10b981" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                        {item.checked && <CheckCircle2 style={{ width:12, height:12, color:"#fff" }} />}
                      </button>
                    </td>
                    <td style={{ padding:"12px 20px", color: item.checked ? "#64748b" : "#fff", fontWeight:500, textDecoration: item.checked ? "line-through" : "none" }}>{item.name}</td>
                    <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{cat.emoji} {cat.label}</td>
                    <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{item.quantity} {item.unit}</td>
                    <td style={{ padding:"12px 20px", color:"#94a3b8" }}>{item.owner || "—"}</td>
                    <td style={{ padding:"12px 20px" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:500, color:status.color }}>
                        <status.icon style={{ width:12, height:12 }} />{status.label}
                      </span>
                    </td>
                    <td style={{ padding:"12px 20px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => openEdit(item)}
                          style={{ padding:"5px 10px", borderRadius:7, border:"none", background:"rgba(255,255,255,0.04)", color:"#94a3b8", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                          <Edit2 style={{ width:11, height:11 }} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(item.id)}
                          style={{ padding:"5px 8px", borderRadius:7, border:"none", background:"rgba(239,68,68,0.08)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center" }}>
                          <Trash2 style={{ width:11, height:11 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditTarget(null); }}
        title={editTarget ? "Edit Item" : "Tambah Item"} size="md">
        <form onSubmit={handleSave} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={labelStyle}>Nama Item *</label>
            <input value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required style={inputStyle} placeholder="Nama barang..." />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select value={form.category} onChange={(e) => setForm({...form, category:e.target.value as CategoryKey})} style={inputStyle}>
                {CAT_KEYS.map(k => <option key={k} value={k}>{catConfig[k].emoji} {catConfig[k].label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status *</label>
              <select value={form.status} onChange={(e) => setForm({...form, status:e.target.value as InventarisPayload["status"]})} style={inputStyle}>
                <option value="tersedia">Tersedia</option>
                <option value="kurang">Kurang</option>
                <option value="tidak_ada">Tidak Ada</option>
              </select>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Jumlah *</label>
              <input type="number" min={0} value={form.quantity} onChange={(e) => setForm({...form, quantity:parseInt(e.target.value)||0})} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Satuan *</label>
              <input value={form.unit} onChange={(e) => setForm({...form, unit:e.target.value})} required style={inputStyle} placeholder="buah, set, kg..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Pemilik</label>
            <input value={form.owner??""} onChange={(e) => setForm({...form, owner:e.target.value})} style={inputStyle} placeholder="Nama pemilik (opsional)" />
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button type="button" onClick={() => setForm({...form, checked:!form.checked})}
              style={{ width:20, height:20, borderRadius:6, border: form.checked ? "none" : "2px solid rgba(255,255,255,0.15)", background: form.checked ? "#10b981" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              {form.checked && <CheckCircle2 style={{ width:12, height:12, color:"#fff" }} />}
            </button>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Tandai sebagai sudah dibawa/tersedia</span>
          </div>

          <div style={{ display:"flex", gap:12, paddingTop:8 }}>
            <button type="submit" disabled={isBusy}
              style={{ ...btnPrimary, flex:1, justifyContent:"center", opacity:isBusy?0.6:1 }}>
              <Save style={{ width:14, height:14 }} />
              {isBusy ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); }} style={btnGhost}>
              <X style={{ width:14, height:14 }} /> Batal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Item?" size="sm">
        <p style={{ color:"#94a3b8", fontSize:14, marginBottom:24 }}>Item inventaris ini akan dihapus secara permanen.</p>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={async () => { if(deleteId){ await deleteInv.mutateAsync(deleteId); setDeleteId(null); }}}
            disabled={deleteInv.isPending}
            style={{ ...btnDanger, flex:1, justifyContent:"center", opacity:deleteInv.isPending?0.6:1 }}>
            {deleteInv.isPending ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button onClick={() => setDeleteId(null)} style={btnGhost}>Batal</button>
        </div>
      </Modal>
    </div>
  );
}
