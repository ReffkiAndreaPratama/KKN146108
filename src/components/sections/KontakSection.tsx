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

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }} className="max-lg:!grid-cols-1">
          {/* Left */}
          <div className="space-y-4">
            {CONTACTS.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#111b2e] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0"><c.icon className="w-4 h-4 text-emerald-400" /></div>
                <div><p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{c.label}</p><p className="text-sm text-white font-medium">{c.value}</p></div>
              </a>
            ))}
          </div>

          {/* Right: Form */}
          <div className="bg-[#111b2e] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <h3 className="text-white font-bold text-lg mb-6">Kirim Pesan</h3>
            {status === "done" ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-white font-bold text-lg">Pesan Terkirim!</p>
                <p className="text-slate-400 text-sm mt-1">Kami akan segera merespons.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">Nama</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600" placeholder="Nama lengkap" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 block">Pesan</label>
                  <textarea value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} required rows={4}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 resize-none" placeholder="Tulis pesan..." />
                </div>
                {status === "error" && <p className="text-sm text-red-400">Gagal mengirim. Coba lagi.</p>}
                <button type="submit" disabled={status==="loading"}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  {status==="loading" ? "Mengirim..." : <><Send className="w-4 h-4" /> Kirim Pesan</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
