export function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ 
      height: 1, 
      background: "linear-gradient(to right, transparent, rgba(16,185,129,0.3), rgba(6,182,212,0.3), transparent)",
      margin: 0 
    }} />
  );
}
