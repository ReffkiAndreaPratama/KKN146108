"use client";

import { useState } from "react";
import { Package, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { inventoryItems } from "@/data/inventory";
import { InventoryItem } from "@/types";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };

const catConfig: Record<InventoryItem["category"], { label: string; emoji: string }> = {
  dapur: { label:"Dapur", emoji:"🍳" },
  kebersihan: { label:"Kebersihan", emoji:"🧹" },
  sekretariat: { label:"Sekretariat", emoji:"📋" },
  p3k: { label:"P3K", emoji:"🏥" },
  pribadi: { label:"Kebutuhan Pribadi", emoji:"👤" },
};

const statusConfig = {
  tersedia: { icon:CheckCircle2, color:"#34d399", label:"Tersedia" },
  kurang: { icon:AlertCircle, color:"#fbbf24", label:"Kurang" },
  tidak_ada: { icon:XCircle, color:"#f87171", label:"Tidak Ada" },
};

export default function InventoryPage() {
  const [activeCat, setActiveCat] = useState<InventoryItem["category"] | "all">("all");
  const [items, setItems] = useState(inventoryItems);
  const filtered = activeCat === "all" ? items : items.filter((i) => i.category === activeCat);
  const checked = items.filter((i) => i.checked).length;
  const progress = Math.round((checked / items.length) * 100);

  const toggleCheck = (id: string) => setItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ ...card, padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Inventaris & Checklist</h1>
            <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>Kelola perlengkapan KKN 146</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:99, padding:"8px 16px" }}>
            <Package style={{ width:16, height:16, color:"#34d399" }} />
            <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{checked}/{items.length}</span>
            <div style={{ width:80, height:6, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(to right, #10b981, #06b6d4)", borderRadius:99 }} />
            </div>
            <span style={{ color:"#34d399", fontSize:13, fontWeight:700 }}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        <button onClick={() => setActiveCat("all")}
          style={{ padding:"8px 16px", borderRadius:12, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: activeCat==="all"?"rgba(255,255,255,0.1)":"transparent", color: activeCat==="all"?"#fff":"#94a3b8", borderColor: activeCat==="all"?"rgba(255,255,255,0.2)":"transparent" }}>
          Semua ({items.length})
        </button>
        {(Object.entries(catConfig) as [InventoryItem["category"], { label:string; emoji:string }][]).map(([key, cat]) => {
          const count = items.filter((i) => i.category === key).length;
          return (
            <button key={key} onClick={() => setActiveCat(key)}
              style={{ padding:"8px 16px", borderRadius:12, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: activeCat===key?"rgba(16,185,129,0.1)":"transparent", color: activeCat===key?"#34d399":"#94a3b8", borderColor: activeCat===key?"rgba(16,185,129,0.2)":"transparent" }}>
              {cat.emoji} {cat.label} ({count})
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
                {["✓","Item","Kategori","Jumlah","Pemilik","Status"].map((h) => (
                  <th key={h} style={{ textAlign:"left", padding:"12px 20px", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const status = statusConfig[item.status];
                const cat = catConfig[item.category];
                return (
                  <tr key={item.id} style={{ borderBottom: i < filtered.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: item.checked ? "rgba(16,185,129,0.03)" : "transparent" }}>
                    <td style={{ padding:"12px 20px" }}>
                      <button onClick={() => toggleCheck(item.id)}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
