import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = { themeColor: "#10b981" };

export const metadata: Metadata = {
  title: "KKN 146 Desa Talang Marap | Universitas Bengkulu",
  description: "Sistem Informasi KKN 146 Desa Talang Marap, Kecamatan Kelam Tengah, Kabupaten Kaur, Provinsi Bengkulu. Universitas Bengkulu — Fakultas Teknik — Informatika.",
  manifest: "/manifest.json",
  openGraph: {
    title: "KKN 146 Desa Talang Marap",
    description: "Pengabdian Mahasiswa untuk Membangun Desa dan Memberdayakan Masyarakat",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
