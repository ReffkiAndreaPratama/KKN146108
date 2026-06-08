export type Role =
  | "super_admin"
  | "ketua"
  | "bendahara"
  | "pdd"
  | "anggota";

export type ProkerStatus = "planning" | "ongoing" | "completed";

export type ProkerCategory =
  | "pendidikan"
  | "sosial"
  | "teknologi"
  | "lingkungan"
  | "umkm"
  | "kesehatan"
  | "keagamaan"
  | "administrasi";

export interface Member {
  id: string;
  name: string;
  nim: string;
  division: string;
  role: string;
  photo?: string;
  quote?: string;
  instagram?: string;
  whatsapp?: string;
  faculty: string;
  prodi: string;
  gender?: string;
  color?: string;
  initials?: string;
  dpl?: string;
}

export interface Proker {
  id: string;
  name: string;
  description: string;
  category: ProkerCategory;
  ketuaPelaksana: string;
  anggota: string[];
  startDate: string;
  endDate: string;
  target: string;
  progress: number;
  status: ProkerStatus;
  dokumentasi?: string[];
  laporan?: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
  createdBy: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "dapur" | "kebersihan" | "sekretariat" | "p3k" | "pribadi";
  quantity: number;
  unit: string;
  owner?: string;
  status: "tersedia" | "kurang" | "tidak_ada";
  checked: boolean;
}

export interface Document {
  id: string;
  name: string;
  category:
    | "proposal"
    | "lpj"
    | "surat"
    | "administrasi"
    | "proker"
    | "keuangan"
    | "dokumentasi";
  fileUrl: string;
  fileType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | "survey"
    | "rapat"
    | "kegiatan"
    | "gotong_royong"
    | "pendidikan"
    | "sosialisasi";
  imageUrl: string;
  date: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  author: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  status: "hadir" | "izin" | "sakit" | "alpha";
  note?: string;
}

export interface PiketSchedule {
  id: string;
  date: string;
  members: string[];
  tasks: string[];
  completed: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  status: "upcoming" | "ongoing" | "completed";
  icon?: string;
}
