"use client";

import { MapPin, Mail, Phone, Instagram, Heart, Leaf } from "lucide-react";
import Link from "next/link";

const QUICK = ["Home", "Tentang Desa", "Tim KKN", "Program Kerja", "Timeline", "Dokumentasi", "Keuangan", "Kontak"];

export default function Footer() {
  return (
    <footer style={{ background: "#040d1a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="cx py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-none">KKN 146</h3>
                <p className="text-emerald-400 text-sm mt-0.5">Desa Talang Marap</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "var(--t2)" }}>
              Pengabdian Mahasiswa Universitas Bengkulu untuk Membangun Desa dan
              Memberdayakan Masyarakat Desa Talang Marap, Kecamatan Kelam Tengah,
              Kabupaten Kaur, Provinsi Bengkulu.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Mail,      href: "mailto:kkn146@unib.ac.id" },
                { icon: Phone,     href: "https://wa.me/6281234567890" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--t2)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#10b981"; (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t2)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK.map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                    className="text-sm transition-colors"
                    style={{ color: "var(--t2)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#10b981"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t2)"; }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informasi</h4>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed" style={{ color: "var(--t2)" }}>
                  Desa Talang Marap, Kec. Kelam Tengah, Kab. Kaur, Bengkulu
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm" style={{ color: "var(--t2)" }}>kkn146@unib.ac.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm" style={{ color: "var(--t2)" }}>@kkn146_talangmarap</span>
              </li>
            </ul>
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs" style={{ color: "var(--t3)" }}>Universitas Bengkulu</p>
              <p className="text-sm font-semibold text-white mt-0.5">Fakultas Teknik</p>
              <p className="text-xs text-emerald-400 mt-0.5">Program Studi Informatika</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm" style={{ color: "var(--t3)" }}>
            © 2026 KKN 146 Desa Talang Marap. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--t3)" }}>
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Tim KKN 146
          </p>
        </div>
      </div>
    </footer>
  );
}
