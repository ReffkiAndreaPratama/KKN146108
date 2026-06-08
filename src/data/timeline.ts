import { TimelineEvent } from "@/types";

export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Survey Lokasi KKN",
    description:
      "Tim melakukan survey awal ke Desa Talang Marap untuk mengenal kondisi desa, bertemu perangkat desa, dan mengidentifikasi potensi program kerja.",
    date: "2026-05-14",
    endDate: "2026-05-15",
    status: "completed",
    icon: "MapPin",
  },
  {
    id: "2",
    title: "Persiapan & Pembekalan",
    description:
      "Pembekalan KKN dari universitas, persiapan perlengkapan, rapat koordinasi tim, dan finalisasi program kerja.",
    date: "2026-05-16",
    endDate: "2026-06-16",
    status: "completed",
    icon: "BookOpen",
  },
  {
    id: "3",
    title: "Keberangkatan ke Lokasi",
    description:
      "Seluruh anggota KKN 146 berangkat menuju Desa Talang Marap, Kecamatan Kelam Tengah, Kabupaten Kaur.",
    date: "2026-06-17",
    status: "upcoming",
    icon: "Car",
  },
  {
    id: "4",
    title: "Penerimaan & Pembukaan KKN",
    description:
      "Acara penerimaan resmi KKN 146 oleh Kepala Desa Talang Marap dan perangkat desa.",
    date: "2026-06-17",
    status: "upcoming",
    icon: "Users",
  },
  {
    id: "5",
    title: "Pelaksanaan Program Kerja",
    description:
      "Pelaksanaan seluruh program kerja KKN 146 meliputi pendidikan, sosial, teknologi, lingkungan, UMKM, kesehatan, dan keagamaan.",
    date: "2026-06-17",
    endDate: "2026-07-31",
    status: "upcoming",
    icon: "Rocket",
  },
  {
    id: "6",
    title: "Monitoring & Evaluasi",
    description:
      "Evaluasi tengah periode pelaksanaan KKN, monitoring progress program kerja, dan penyesuaian rencana.",
    date: "2026-07-10",
    status: "upcoming",
    icon: "BarChart",
  },
  {
    id: "7",
    title: "Penutupan & Perpisahan",
    description:
      "Acara penutupan resmi KKN 146 bersama seluruh warga Desa Talang Marap, penyerahan hasil program kerja.",
    date: "2026-07-30",
    status: "upcoming",
    icon: "Award",
  },
  {
    id: "8",
    title: "Kepulangan",
    description:
      "Seluruh anggota KKN 146 kembali ke Universitas Bengkulu.",
    date: "2026-07-31",
    status: "upcoming",
    icon: "Home",
  },
];
