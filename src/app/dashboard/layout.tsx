import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AuthGuard } from "@/components/dashboard/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ minHeight:"100vh", display:"flex", background:"#0b1121" }}>
        <DashboardSidebar />
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
          <DashboardHeader />
          <main style={{ flex:1, padding:"clamp(16px, 3vw, 24px)", overflowY:"auto" }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
