import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TentangDesaSection from "@/components/sections/TentangDesaSection";
import TeamSection from "@/components/sections/TeamSection";
import ProkerSection from "@/components/sections/ProkerSection";
import TimelineSection from "@/components/sections/TimelineSection";
import DokumentasiSection from "@/components/sections/DokumentasiSection";
import PiketSection from "@/components/sections/PiketSection";
import KontakSection from "@/components/sections/KontakSection";

export default function Home() {
  return (
    <main className="bg-[#0b1121]">
      <Navbar />
      <HeroSection />
      <TentangDesaSection />
      <TeamSection />
      <ProkerSection />
      <TimelineSection />
      <DokumentasiSection />
      <PiketSection />
      <KontakSection />
      <Footer />
    </main>
  );
}
