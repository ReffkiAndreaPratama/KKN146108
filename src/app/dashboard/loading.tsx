export default function DashboardLoading() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
        <div style={{ width:32, height:32, border:"3px solid rgba(255,255,255,0.1)", borderTopColor:"#10b981", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
        <p style={{ fontSize:13, color:"#64748b" }}>Memuat...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
