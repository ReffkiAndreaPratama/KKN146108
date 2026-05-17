"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (login(username, password)) {
      router.replace("/dashboard");
    } else {
      setError("Username atau password salah.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}>
      {/* Background */}
      <div className="orb absolute top-1/4 left-1/4 w-80 h-80 pointer-events-none" style={{ background: "rgba(16,185,129,0.06)" }} />
      <div className="orb absolute bottom-1/4 right-1/4 w-64 h-64 pointer-events-none" style={{ background: "rgba(6,182,212,0.06)", animationDelay: "-5s" }} />
      <div className="grid-overlay absolute inset-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[380px]"
      >
        {/* Back link */}
        <Link href="/" className="flex items-center gap-1.5 text-xs mb-6 transition-colors"
          style={{ color: "var(--t3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t3)"; }}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Landing Page
        </Link>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-white font-bold text-lg text-center">KKN 146 Dashboard</h1>
              <p className="text-sm mt-1 text-center" style={{ color: "var(--t2)" }}>Masuk sebagai Admin</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="lbl">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--t3)" }} />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    required autoComplete="username" placeholder="admin" className="inp pl-10" />
                </div>
              </div>

              <div>
                <label className="lbl">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--t3)" }} />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    required autoComplete="current-password" placeholder="••••••••" className="inp pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass((v) => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--t3)" }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="btn btn-primary w-full py-3.5 text-[15px] disabled:opacity-60 mt-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />Masuk...</>
                  : "Masuk ke Dashboard"
                }
              </button>
            </form>

            <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: "var(--t3)" }}>
              Halaman ini hanya untuk admin KKN 146.
            </p>
          </div>
        </div>

        <p className="text-xs text-center mt-5" style={{ color: "var(--t3)" }}>
          KKN 146 · Desa Talang Marap · Universitas Bengkulu
        </p>
      </motion.div>
    </div>
  );
}
