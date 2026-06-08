export function SectionDivider() {
  return (
    <div style={{ position:"relative", height:40, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      {/* Glow background */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent, rgba(16,185,129,0.03), transparent)" }} />
      {/* Line */}
      <div style={{ width:"100%", height:1, background:"linear-gradient(to right, transparent, rgba(16,185,129,0.4), rgba(6,182,212,0.4), rgba(16,185,129,0.4), transparent)" }} />
      {/* Center dot */}
      <div style={{ position:"absolute", width:8, height:8, borderRadius:"50%", background:"linear-gradient(135deg, #10b981, #06b6d4)", boxShadow:"0 0 12px rgba(16,185,129,0.6)" }} />
    </div>
  );
}
