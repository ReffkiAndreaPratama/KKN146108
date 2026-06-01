"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTASection() {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-[#07111f]">
      <div className="max-w-[1160px] mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/30"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=75"
              alt="Mountain landscape"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1160px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/95 via-[#07111f]/80 to-[#07111f]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-14 sm:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Universitas Bengkulu 2026
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Mengabdi dengan <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Hati</span>,<br />
                Bergerak dengan <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Inovasi</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                Bersama membangun Desa Talang Marap menjadi lebih baik melalui program kerja yang berdampak nyata bagi masyarakat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <button
                onClick={() => document.getElementById("proker")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Lihat Program Kerja</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-slate-200 font-bold rounded-2xl hover:bg-white/10 hover:text-white hover:-translate-y-1 transition-all backdrop-blur-md"
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
