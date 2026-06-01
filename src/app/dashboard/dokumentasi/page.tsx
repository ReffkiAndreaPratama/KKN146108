"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

const card: React.CSSProperties = { background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 };

const ITEMS = [
  { id:"1", title:"Survey Lokasi KKN", cat:"Survey", date:"14 Mei 2026", color:"from-emerald-500 to-teal-400", emoji:"🗺️" },
  { id:"2", title:"Rapat Koordinasi Tim", cat:"Rapat", date:"16 Mei 2026", color:"from-cyan-500 to-blue-400", emoji:"👥" },
  { id:"3", title:"Penerimaan di Desa", cat:"Kegiatan", date:"29 Mei 2026", color:"from-violet-500 to-purple-400", emoji:"🏡" },
  { id:"4", title:"Gotong Royong Desa", cat:"Gotong Royong", date:"7 Jun 2026", color:"from-amber-500 to-orange-400", emoji:"🌿" },
  { id:"5", title:"Bimbel Anak SD", cat:"Pendidikan", date:"1 Jun 2026", color:"from-pink-500 to-rose-400", emoji:"📚" },
  { id:"6", title:"Sosialisasi Kesehatan", cat:"Sosialisasi", date:"10 Jun 2026", color:"from-red-500 to-pink-400", emoji:"🏥" },
  { id:"7", title:"Pelatihan UMKM", cat:"Kegiatan", date:"5 Jun 2026", color:"from-indigo-500 to-blue-400", emoji:"💼" },
  { id:"8", title:"Pengajian Rutin", cat:"Kegiatan", date:"3 Jun 2026", color:"from-teal-500 to-emerald-400", emoji:"🕌" },
];

export default function DokumentasiDashboardPage() {
  const [cat, setCat] = useState("Semua");
  const cats = ["Semua", ...Array.from(new Set(ITEMS.map((i) => i.cat)))];
  const filtered = cat === "Semua" ? ITEMS : ITEMS.filter((i) => i.cat === cat);

  return (
    <div style={{ maxWidth:1100, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ ...card, padding:24 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#fff" }}>Dokumentasi</h1>
        <p style={{ fontSize:14, color:"#94a3b8", marginTop:4 }}>{ITEMS.length} foto kegiatan</p>
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding:"8px 16px", borderRadius:99, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: cat===c?"rgba(255,255,255,0.1)":"transparent", color: cat===c?"#fff":"#94a3b8", borderColor: cat===c?"rgba(255,255,255,0.2)":"transparent" }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
        {filtered.map((item) => (
          <div key={item.id} style={{ ...card, overflow:"hidden" }}>
            <div className={`bg-gradient-to-br ${item.color}`} style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:48 }}>{item.emoji}</span>
            </div>
            <div style={{ padding:16 }}>
              <p style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:4 }}>{item.title}</p>
              <p style={{ color:"#64748b", fontSize:11 }}>{item.date} · {item.cat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
