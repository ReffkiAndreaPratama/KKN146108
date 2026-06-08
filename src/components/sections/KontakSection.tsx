"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Instagram, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";

const CONTACTS = [
  { icon: Mail, label: "Email", value: "kkn146@unib.ac.id", href: "mailto:kkn146@unib.ac.id" },
  { icon: Phone, label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
  { icon: Instagram, label: "Instagram", value: "@kkn146_talangmarap", href: "https://instagram.com" },
  { icon: MapPin, label: "Lokasi", value: "Desa Talang Marap, Kab. Kaur", href: "#" },
];

export default function KontakSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try { const res = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) }); if (!res.ok) throw new Error(); setStatus("done"); setForm({ name:"", email:"", message:"" }); setTimeout(() => setStatus("idle"), 5000); }
    catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
  };

  return (
    <section id="kontak" className="py-24 sm:py-32" style={{ background:"#0d1525" }} ref={ref}>
      <div className="wrapper">
        <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} style={{ textAlign:"center", marginBottom:48 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-5">
            <MessageSquare className="w-3.5 h-3.5" /> Kontak
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Kami</span>
          </h2>
          <p style={{ color:"#94a3b8", maxWidth:480, margin:"0 auto", textAlign:"center" }}>Ada pertanyaan atau ingin berkolaborasi? Hubungi kami.</p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }} className="max-lg:!grid-cols-1">
          {/* Left — Info Kontak */}
          <div style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:24, padding:"32px 28px", display:"flex", flexDirection:"column", gap:0 }}>
            <h3 style={{ color:"#fff", fontWeight:700, fontSize:18, marginBottom:8 }}>Info Kontak</h3>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:28 }}>Jangan ragu untuk menghubungi kami.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {CONTACTS.map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, textDecoration:"none", transition:"border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <c.icon style={{ width:18, height:18, color:"#34d399" }} />
                  </div>
                  <div>
                    <p style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:3 }}>{c.label}</p>
                    <p style={{ fontSize:14, color:"#e2e8f0", fontWeight:500 }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:24, padding:"32px 28px" }}>
            <h3 style={{ color:"#fff", fontWeight:700, fontSize:18, marginBottom:8 }}>Kirim Pesan</h3>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:28 }}>Kami akan membalas secepatnya.</p>
            {status === "done" ? (
              <div style={{ textAlign:"center", padding:"48px 0" }}>
                <CheckCircle2 style={{ width:48, height:48, color:"#34d399", margin:"0 auto 16px" }} />
                <p style={{ color:"#fff", fontWeight:700, fontSize:18 }}>Pesan Terkirim!</p>
                <p style={{ color:"#64748b", fontSize:13, marginTop:6 }}>Kami akan segera merespons.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Nama</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required
                    placeholder="Nama lengkap"
                    style={{ width:"100%", padding:"12px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:14, outline:"none" }}
                    onFocus={(e) => e.target.style.borderColor="rgba(16,185,129,0.4)"}
                    onBlur={(e) => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required
                    placeholder="email@example.com"
                    style={{ width:"100%", padding:"12px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:14, outline:"none" }}
                    onFocus={(e) => e.target.style.borderColor="rgba(16,185,129,0.4)"}
                    onBlur={(e) => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Pesan</label>
                  <textarea value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} required rows={5}
                    placeholder="Tulis pesan..."
                    style={{ width:"100%", padding:"12px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:14, outline:"none", resize:"none" }}
                    onFocus={(e) => e.target.style.borderColor="rgba(16,185,129,0.4)"}
                    onBlur={(e) => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                </div>
                {status === "error" && <p style={{ color:"#f87171", fontSize:13 }}>Gagal mengirim. Coba lagi.</p>}
                <button type="submit" disabled={status==="loading"}
                  style={{ width:"100%", padding:"14px 0", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:700, fontSize:14, borderRadius:12, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: status==="loading" ? 0.6 : 1, marginTop:4 }}>
                  {status==="loading" ? "Mengirim..." : <><Send style={{ width:16, height:16 }} /> Kirim Pesan</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
