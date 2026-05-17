import { InventoryItem } from "@/types";

export const inventoryItems: InventoryItem[] = [
  // DAPUR
  { id: "d1", name: "Kompor Gas", category: "dapur", quantity: 1, unit: "buah", owner: "Bela", status: "tersedia", checked: true },
  { id: "d2", name: "Tabung Gas 3kg", category: "dapur", quantity: 2, unit: "tabung", owner: "Ping", status: "tersedia", checked: true },
  { id: "d3", name: "Rice Cooker", category: "dapur", quantity: 1, unit: "buah", owner: "Revina", status: "tersedia", checked: true },
  { id: "d4", name: "Panci Besar", category: "dapur", quantity: 2, unit: "buah", owner: "Nisa", status: "tersedia", checked: true },
  { id: "d5", name: "Panci Kecil", category: "dapur", quantity: 1, unit: "buah", owner: "Bela", status: "tersedia", checked: false },
  { id: "d6", name: "Talenan", category: "dapur", quantity: 2, unit: "buah", owner: "Rezy", status: "tersedia", checked: true },
  { id: "d7", name: "Blender", category: "dapur", quantity: 1, unit: "buah", owner: "Ferlin", status: "kurang", checked: false },
  { id: "d8", name: "Pisau Dapur", category: "dapur", quantity: 3, unit: "buah", owner: "Danil", status: "tersedia", checked: true },
  { id: "d9", name: "Wajan", category: "dapur", quantity: 2, unit: "buah", owner: "Bela", status: "tersedia", checked: true },
  { id: "d10", name: "Spatula", category: "dapur", quantity: 2, unit: "buah", owner: "Nisa", status: "tersedia", checked: true },
  { id: "d11", name: "Piring", category: "dapur", quantity: 10, unit: "buah", owner: "Revina", status: "tersedia", checked: true },
  { id: "d12", name: "Gelas", category: "dapur", quantity: 10, unit: "buah", owner: "Rezy", status: "tersedia", checked: true },

  // KEBERSIHAN
  { id: "k1", name: "Sapu", category: "kebersihan", quantity: 2, unit: "buah", owner: "Nisa", status: "tersedia", checked: true },
  { id: "k2", name: "Pel Lantai", category: "kebersihan", quantity: 1, unit: "buah", owner: "Bela", status: "tersedia", checked: true },
  { id: "k3", name: "Ember", category: "kebersihan", quantity: 3, unit: "buah", owner: "Danil", status: "tersedia", checked: true },
  { id: "k4", name: "Gayung", category: "kebersihan", quantity: 2, unit: "buah", owner: "Rezy", status: "tersedia", checked: true },
  { id: "k5", name: "Keset", category: "kebersihan", quantity: 2, unit: "buah", owner: "Ferlin", status: "tersedia", checked: false },
  { id: "k6", name: "Sabun Cuci Piring", category: "kebersihan", quantity: 3, unit: "botol", owner: "Bela", status: "tersedia", checked: true },
  { id: "k7", name: "Sabun Cuci Baju", category: "kebersihan", quantity: 2, unit: "kg", owner: "Revina", status: "tersedia", checked: true },
  { id: "k8", name: "Sikat WC", category: "kebersihan", quantity: 1, unit: "buah", owner: "Nisa", status: "kurang", checked: false },

  // SEKRETARIAT
  { id: "s1", name: "Printer", category: "sekretariat", quantity: 1, unit: "buah", owner: "Reffki", status: "tersedia", checked: true },
  { id: "s2", name: "Kabel Panjang (Roll)", category: "sekretariat", quantity: 2, unit: "buah", owner: "Ping", status: "tersedia", checked: true },
  { id: "s3", name: "Kertas A4", category: "sekretariat", quantity: 4, unit: "rim", owner: "Revina", status: "tersedia", checked: true },
  { id: "s4", name: "Amplop Surat", category: "sekretariat", quantity: 50, unit: "lembar", owner: "Revina", status: "tersedia", checked: true },
  { id: "s5", name: "Spanduk KKN", category: "sekretariat", quantity: 2, unit: "buah", owner: "Reffki", status: "tersedia", checked: true },
  { id: "s6", name: "Obeng Set", category: "sekretariat", quantity: 1, unit: "set", owner: "Danil", status: "tersedia", checked: true },
  { id: "s7", name: "Gunting", category: "sekretariat", quantity: 2, unit: "buah", owner: "Revina", status: "tersedia", checked: true },
  { id: "s8", name: "Stapler", category: "sekretariat", quantity: 1, unit: "buah", owner: "Revina", status: "tersedia", checked: true },

  // P3K
  { id: "p1", name: "Paracetamol", category: "p3k", quantity: 2, unit: "strip", owner: "Bela", status: "tersedia", checked: true },
  { id: "p2", name: "Promag", category: "p3k", quantity: 1, unit: "strip", owner: "Nisa", status: "tersedia", checked: true },
  { id: "p3", name: "Koyo", category: "p3k", quantity: 3, unit: "lembar", owner: "Rezy", status: "tersedia", checked: true },
  { id: "p4", name: "Minyak Angin", category: "p3k", quantity: 2, unit: "botol", owner: "Bela", status: "tersedia", checked: true },
  { id: "p5", name: "Plester", category: "p3k", quantity: 1, unit: "kotak", owner: "Ferlin", status: "tersedia", checked: true },
  { id: "p6", name: "Betadine", category: "p3k", quantity: 1, unit: "botol", owner: "Bela", status: "kurang", checked: false },
  { id: "p7", name: "Perban", category: "p3k", quantity: 2, unit: "gulung", owner: "Nisa", status: "tersedia", checked: true },

  // KEBUTUHAN PRIBADI
  { id: "pr1", name: "Skincare Set", category: "pribadi", quantity: 1, unit: "set", owner: "Masing-masing", status: "tersedia", checked: true },
  { id: "pr2", name: "Jaket", category: "pribadi", quantity: 1, unit: "buah", owner: "Masing-masing", status: "tersedia", checked: true },
  { id: "pr3", name: "Obat-obatan Pribadi", category: "pribadi", quantity: 1, unit: "set", owner: "Masing-masing", status: "tersedia", checked: true },
  { id: "pr4", name: "Alat Sholat", category: "pribadi", quantity: 1, unit: "set", owner: "Masing-masing", status: "tersedia", checked: true },
  { id: "pr5", name: "Hanger Baju", category: "pribadi", quantity: 5, unit: "buah", owner: "Masing-masing", status: "tersedia", checked: false },
  { id: "pr6", name: "Sepatu/Sandal", category: "pribadi", quantity: 2, unit: "pasang", owner: "Masing-masing", status: "tersedia", checked: true },
];
