"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (login(username, password)) {
      router.replace("/dashboard");
    } else {
      setError("Username atau password salah.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"#0b1121", position:"relative", overflow:"hidden" }}>
      {/* Background Image */}
      <div style={{ position:"absolute", inset:0 }}>
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="" fill style={{ objectFit:"cover", opacity:0.08 }} sizes="100vw" />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(11,17,33,0.7), #0b1121)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position:"relative", zIndex:10, width:"100%", maxWidth:400 }}
      >
        {/* Back link */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#64748b", textDecoration:"none", marginBottom:24 }}>
          <ArrowLeft style={{ width:14, height:14 }} /> Kembali ke Landing Page
        </Link>

        {/* Card */}
        <div style={{ background:"#111b2e", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, overflow:"hidden", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)" }}>
          {/* Accent bar */}
          <div style={{ height:3, background:"linear-gradient(to right, #10b981, #06b6d4)" }} />

          <div style={{ padding:32 }}>
            {/* Logo */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg, #10b981, #06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 25px rgba(16,185,129,0.2)", marginBottom:16 }}>
                <Leaf style={{ width:28, height:28, color:"#fff" }} />
              </div>
              <h1 style={{ color:"#fff", fontWeight:700, fontSize:20, textAlign:"center" }}>KKN 146 Dashboard</h1>
              <p style={{ color:"#94a3b8", fontSize:14, marginTop:4, textAlign:"center" }}>Masuk sebagai Admin</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Username</label>
                <div style={{ position:"relative" }}>
                  <User style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:"#475569", pointerEvents:"none" }} />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    required autoComplete="username" placeholder="admin"
                    style={{ width:"100%", padding:"12px 12px 12px 40px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:14, outline:"none" }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(16,185,129,0.4)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Password</label>
                <div style={{ position:"relative" }}>
                  <Lock style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:"#475569", pointerEvents:"none" }} />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    required autoComplete="current-password" placeholder="••••••••"
                    style={{ width:"100%", padding:"12px 40px 12px 40px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#fff", fontSize:14, outline:"none" }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(16,185,129,0.4)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                  <button type="button" onClick={() => setShowPass((v) => !v)} tabIndex={-1}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#475569" }}>
                    {showPass ? <EyeOff style={{ width:16, height:16 }} /> : <Eye style={{ width:16, height:16 }} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, fontSize:13, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", marginBottom:16 }}>
                  <AlertCircle style={{ width:16, height:16, flexShrink:0 }} />
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"14px 0", background:"linear-gradient(to right, #10b981, #06b6d4)", color:"#fff", fontWeight:700, fontSize:15, borderRadius:12, border:"none", cursor:"pointer", marginTop:8, opacity: loading ? 0.6 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading
                  ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.6s linear infinite", display:"inline-block" }} />Masuk...</>
                  : "Masuk ke Dashboard"
                }
              </button>
            </form>

            <p style={{ fontSize:12, textAlign:"center", marginTop:24, color:"#475569", lineHeight:1.5 }}>
              Halaman ini hanya untuk admin KKN 146.
            </p>
          </div>
        </div>

        <p style={{ fontSize:12, textAlign:"center", marginTop:20, color:"#475569" }}>
          KKN 146 · Desa Talang Marap · Universitas Bengkulu
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
