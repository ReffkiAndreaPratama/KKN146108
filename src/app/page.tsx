import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TentangDesaSection from "@/components/sections/TentangDesaSection";
import TeamSection from "@/components/sections/TeamSection";
import ProkerSection from "@/components/sections/ProkerSection";
import TimelineSection from "@/components/sections/TimelineSection";
import DokumentasiSection from "@/components/sections/DokumentasiSection";
import KeuanganSection from "@/components/sections/KeuanganSection";
import InventorySection from "@/components/sections/InventorySection";
import KontakSection from "@/components/sections/KontakSection";

export default function Home() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <Navbar />
      <HeroSection />
      <TentangDesaSection />
      <TeamSection />
      <ProkerSection />
      <TimelineSection />
      <DokumentasiSection />
      <KeuanganSection />
      <InventorySection />
      <KontakSection />
      <Footer />
    </main>
  );
}
