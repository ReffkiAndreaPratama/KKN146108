import Link from "next/link";
import { Leaf, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/25">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-extrabold text-white mb-2 leading-none">
          4<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">0</span>4
        </h1>
        <h2 className="text-xl font-bold text-white mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Kembali ke halaman utama KKN 146 Desa Talang Marap.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <span className="btn-primary cursor-pointer">
              <Home className="w-4 h-4" />
              Ke Landing Page
            </span>
          </Link>
          <Link href="/login">
            <span className="btn-ghost cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Dashboard Admin
            </span>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-slate-600 text-xs mt-10">
          KKN 146 · Desa Talang Marap · Universitas Bengkulu
        </p>
      </div>
    </div>
  );
}
