"use client";

import { MapPin, Mail, Instagram, Heart, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background:"#080e1a", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div className="wrapper" style={{ paddingTop:64, paddingBottom:64 }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:40, marginBottom:48 }} className="max-md:!grid-cols-1">
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center" }}><Leaf style={{ width:16, height:16, color:"#fff" }} /></div>
              <div><p style={{ color:"#fff", fontWeight:700, fontSize:14 }}>KKN 146</p><p style={{ color:"#34d399", fontSize:12 }}>Desa Talang Marap</p></div>
            </div>
            <p style={{ color:"#94a3b8", fontSize:14, lineHeight:1.7, maxWidth:320 }}>Pengabdian Mahasiswa Universitas Bengkulu untuk Membangun Desa Talang Marap, Kab. Kaur, Bengkulu.</p>
          </div>
          <div>
            <h4 style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:16 }}>Quick Links</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
              {["Home","Tentang","Tim","Proker","Timeline","Dokumentasi","Piket","Kontak"].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`} style={{ color:"#94a3b8", fontSize:13, textDecoration:"none" }}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color:"#fff", fontWeight:600, fontSize:13, marginBottom:16 }}>Kontak</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:12 }}>
              <li style={{ display:"flex", alignItems:"center", gap:8, color:"#94a3b8", fontSize:13 }}><MapPin style={{ width:14, height:14, color:"#34d399" }} />Desa Talang Marap, Kab. Kaur</li>
              <li style={{ display:"flex", alignItems:"center", gap:8, color:"#94a3b8", fontSize:13 }}><Mail style={{ width:14, height:14, color:"#34d399" }} />kkntalangmarap@gmail.com</li>
              <li style={{ display:"flex", alignItems:"center", gap:8, color:"#94a3b8", fontSize:13 }}><Instagram style={{ width:14, height:14, color:"#34d399" }} />@kkn146_talangmarap</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"#475569", fontSize:12 }}>© 2026 KKN 146 Desa Talang Marap</p>
          <p style={{ color:"#475569", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>Made with <Heart style={{ width:12, height:12, color:"#f87171", fill:"#f87171" }} /> by Tim KKN 146</p>
        </div>
      </div>
    </footer>
  );
}
