"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Instagram, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACTS = [
  { icon: Mail,      label: "Email",        value: "kkn146@unib.ac.id",           href: "mailto:kkn146@unib.ac.id",    color: "#10b981" },
  { icon: Phone,     label: "WhatsApp",     value: "+62 812-3456-7890",            href: "https://wa.me/6281234567890", color: "#22c55e" },
  { icon: Instagram, label: "Instagram",    value: "@kkn146_talangmarap",          href: "https://instagram.com",       color: "#ec4899" },
  { icon: MapPin,    label: "Lokasi Posko", value: "Desa Talang Marap, Kab. Kaur", href: "#",                          color: "#06b6d4" },
];

export default function KontakSection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="kontak" className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="sdiv absolute top-0 inset-x-0" />
      <div className="orb absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "rgba(16,185,129,0.04)" }} />
      <div className="orb absolute bottom-0 right-0 w-[350px] h-[350px] pointer-events-none" style={{ background: "rgba(6,182,212,0.04)", animationDelay:"-6s" }} />

      <div className="cx" ref={ref}>
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:.55 }} className="text-center mb-14">
          <div className="sbdg inline-flex"><MessageSquare className="w-3.5 h-3.5" />Kontak</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Hubungi <span className="gt">Kami</span></h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color:"var(--t2)" }}>
            Ada pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.55, delay:.15 }} className="flex flex-col gap-3">
            {CONTACTS.map((c, i) => (
              <motion.a key={c.label} href={c.href}
                target={c.href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
                initial={{ opacity:0, x:-14 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.4, delay:.2+i*.08 }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background:`${c.color}10`, border:`1px solid ${c.color}22` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:`${c.color}18`, border:`1px solid ${c.color}28` }}>
                  <c.icon className="w-4 h-4" style={{ color:c.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium" style={{ color:"var(--t3)" }}>{c.label}</p>
                  <p className="text-sm font-semibold text-white mt-0.5 truncate">{c.value}</p>
                </div>
              </motion.a>
            ))}

            <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:.55 }}
              className="rounded-2xl overflow-hidden mt-1" style={{ height:180, border:"1px solid var(--border)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63752.48!2d103.4!3d-4.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1f5b5b5b5b5b5b%3A0x0!2sKelam+Tengah%2C+Kaur%2C+Bengkulu!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%" height="100%"
                style={{ border:0, filter:"invert(90%) hue-rotate(180deg)" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Posko KKN"
              />
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity:0, x:20 }} animate={v?{opacity:1,x:0}:{}} transition={{ duration:.55, delay:.25 }}>
            <div className="card card-p h-full" style={{ padding:"28px" }}>
              <h3 className="text-white font-bold text-lg mb-6">Kirim Pesan</h3>

              {status === "done" ? (
                <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)" }}>
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-white font-bold text-lg">Pesan Terkirim!</p>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color:"var(--t2)" }}>
                    Terima kasih atas pesan Anda.<br />Kami akan segera merespons.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="lbl">Nama Lengkap</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required placeholder="Nama lengkap Anda" className="inp" />
                  </div>
                  <div>
                    <label className="lbl">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required placeholder="email@example.com" className="inp" />
                  </div>
                  <div>
                    <label className="lbl">Pesan / Kritik & Saran</label>
                    <textarea value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} required rows={5} placeholder="Tulis pesan Anda di sini..." className="inp" />
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-red-400">Gagal mengirim pesan. Coba lagi.</p>
                  )}
                  <button type="submit" disabled={status==="loading"} className="btn btn-primary w-full py-3.5 text-[15px] disabled:opacity-60">
                    {status==="loading"
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />Mengirim...</>
                      : <><Send className="w-4 h-4" />Kirim Pesan</>
                    }
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
