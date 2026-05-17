/**
 * Export utilities — PDF & Excel
 * Supports: Anggota, Proker, Keuangan, Absensi, Inventaris
 */

import type { MemberRow, ProkerRow, TransactionRow } from "@/types/database";
import type { InventoryItem } from "@/types";

/* ─── helpers ─────────────────────────────────────────────── */
function formatRp(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(d: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
}

function todayStr(): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/* ══════════════════════════════════════════════════════════════
   EXCEL EXPORTS
══════════════════════════════════════════════════════════════ */

async function downloadExcel(
  rows: Record<string, string | number>[],
  sheetName: string,
  fileName: string
) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2,
  }));
  ws["!cols"] = colWidths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function exportAnggotaExcel(members: MemberRow[]) {
  const rows = members.map((m, i) => ({
    No: i + 1,
    Nama: m.name,
    NIM: m.nim,
    Divisi: m.division,
    Jabatan: m.role,
    Fakultas: m.faculty,
    "Program Studi": m.prodi,
    "Jenis Kelamin": m.gender,
    Instagram: m.instagram ?? "-",
  }));
  await downloadExcel(rows, "Anggota", "Anggota_KKN146");
}

export async function exportProkerExcel(proker: ProkerRow[]) {
  const rows = proker.map((p, i) => ({
    No: i + 1,
    "Nama Program Kerja": p.name,
    Kategori: p.category,
    "Ketua Pelaksana": p.ketua_pelaksana,
    Target: p.target,
    "Tanggal Mulai": fmtDate(p.start_date),
    "Tanggal Selesai": fmtDate(p.end_date),
    "Progress (%)": p.progress,
    Status: p.status,
  }));
  await downloadExcel(rows, "Program Kerja", "ProKer_KKN146");
}

export async function exportKeuanganExcel(transactions: TransactionRow[]) {
  const income  = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const rows = [
    ...transactions.map((t, i) => ({
      No: i + 1,
      Tanggal: fmtDate(t.date),
      Deskripsi: t.description,
      Kategori: t.category,
      Tipe: t.type === "income" ? "Pemasukan" : "Pengeluaran",
      "Jumlah (Rp)": t.amount,
      "Dicatat Oleh": t.created_by,
    })),
    { No: "", Tanggal: "", Deskripsi: "", Kategori: "", Tipe: "", "Jumlah (Rp)": "", "Dicatat Oleh": "" },
    { No: "", Tanggal: "", Deskripsi: "TOTAL PEMASUKAN",  Kategori: "", Tipe: "", "Jumlah (Rp)": income,          "Dicatat Oleh": "" },
    { No: "", Tanggal: "", Deskripsi: "TOTAL PENGELUARAN",Kategori: "", Tipe: "", "Jumlah (Rp)": expense,         "Dicatat Oleh": "" },
    { No: "", Tanggal: "", Deskripsi: "SALDO",            Kategori: "", Tipe: "", "Jumlah (Rp)": income - expense, "Dicatat Oleh": "" },
  ];
  await downloadExcel(rows, "Keuangan", "Keuangan_KKN146");
}

export async function exportInventarisExcel(items: InventoryItem[]) {
  const rows = items.map((item, i) => ({
    No: i + 1,
    Nama: item.name,
    Kategori: item.category,
    Jumlah: item.quantity,
    Satuan: item.unit,
    Pemilik: item.owner ?? "-",
    Status: item.status,
    "Sudah Dicek": item.checked ? "Ya" : "Tidak",
  }));
  await downloadExcel(rows, "Inventaris", "Inventaris_KKN146");
}

export async function exportAbsensiExcel(
  attendance: { name: string; date: string; status: string; note?: string | null }[]
) {
  const rows = attendance.map((a, i) => ({
    No: i + 1,
    Nama: a.name,
    Tanggal: fmtDate(a.date),
    Status: a.status,
    Keterangan: a.note ?? "-",
  }));
  await downloadExcel(rows, "Absensi", "Absensi_KKN146");
}

/* ══════════════════════════════════════════════════════════════
   PDF EXPORTS
══════════════════════════════════════════════════════════════ */

type RGB = [number, number, number];

const C = {
  primary:   [16, 185, 129]  as RGB,
  secondary: [6, 182, 212]   as RGB,
  dark:      [15, 23, 42]    as RGB,
  card:      [17, 24, 39]    as RGB,
  rowAlt:    [30, 41, 59]    as RGB,
  white:     [255, 255, 255] as RGB,
  gray:      [148, 163, 184] as RGB,
  body:      [226, 232, 240] as RGB,
  red:       [239, 68, 68]   as RGB,
  amber:     [245, 158, 11]  as RGB,
  blue:      [96, 165, 250]  as RGB,
};

/* Build a jsPDF doc with branded header */
async function makePDF(title: string, subtitle?: string) {
  // Dynamic import to avoid SSR issues
  const jsPDFModule = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JsPDF = (jsPDFModule as any).default ?? jsPDFModule.jsPDF ?? jsPDFModule;
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W: number = doc.internal.pageSize.getWidth();

  // Header bg
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, W, 42, "F");

  // Accent bar
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, 4, 42, "F");

  // Title
  doc.setTextColor(...C.white);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  doc.text(title, 12, 16);

  // Subtitle
  if (subtitle) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(subtitle, 12, 25);
  }

  // Meta
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(`KKN 146 · Desa Talang Marap · Dicetak: ${todayStr()}`, 12, 35);

  return { doc, startY: 50, W };
}

/* Add footer to every page */
function addFooter(doc: ReturnType<typeof Object.create>, W: number) {
  const H: number = doc.internal.pageSize.getHeight();
  doc.setFillColor(...C.dark);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setFontSize(7);
  doc.setTextColor(...C.gray);
  doc.text(
    "KKN 146 Universitas Bengkulu · Desa Talang Marap, Kec. Kelam Tengah, Kab. Kaur, Bengkulu",
    W / 2,
    H - 5,
    { align: "center" }
  );
}

/* Common table styles */
const tableStyles = {
  styles: {
    fontSize: 8,
    cellPadding: 3,
    textColor: C.body,
    fillColor: C.card,
    lineColor: C.rowAlt,
    lineWidth: 0.1,
  },
  headStyles: {
    fillColor: C.primary,
    textColor: C.white,
    fontStyle: "bold" as const,
    fontSize: 8,
  },
  alternateRowStyles: { fillColor: C.rowAlt },
  margin: { left: 10, right: 10 },
};

/* ── Anggota PDF ─────────────────────────────────────────── */
export async function exportAnggotaPDF(members: MemberRow[]) {
  const { doc, startY, W } = await makePDF(
    "Daftar Anggota KKN 146",
    "Universitas Bengkulu · Fakultas Teknik · Informatika"
  );
  const autoTable = (await import("jspdf-autotable")).default;

  autoTable(doc, {
    startY,
    head: [["No", "Nama", "NIM", "Divisi", "Fakultas", "Prodi", "JK"]],
    body: members.map((m, i) => [
      i + 1, m.name, m.nim, m.division, m.faculty, m.prodi,
      m.gender === "Perempuan" ? "P" : "L",
    ]),
    ...tableStyles,
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 45 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 40 },
      5: { cellWidth: 30 },
      6: { cellWidth: 8 },
    },
  });

  addFooter(doc, W);
  doc.save(`Anggota_KKN146_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Proker PDF ──────────────────────────────────────────── */
export async function exportProkerPDF(proker: ProkerRow[]) {
  const { doc, startY, W } = await makePDF(
    "Laporan Program Kerja KKN 146",
    "Desa Talang Marap · Kec. Kelam Tengah · Kab. Kaur · Bengkulu"
  );
  const autoTable = (await import("jspdf-autotable")).default;

  const completed = proker.filter((p) => p.status === "completed").length;
  const ongoing   = proker.filter((p) => p.status === "ongoing").length;
  const planning  = proker.filter((p) => p.status === "planning").length;
  const avg       = proker.length
    ? Math.round(proker.reduce((a, p) => a + p.progress, 0) / proker.length)
    : 0;

  // Summary box
  doc.setFillColor(...C.card);
  doc.roundedRect(10, startY - 4, W - 20, 16, 2, 2, "F");
  doc.setFontSize(8);
  const sy = startY + 5;
  doc.setTextColor(...C.gray);   doc.text(`Total: ${proker.length}`, 16, sy);
  doc.setTextColor(...C.primary); doc.text(`Completed: ${completed}`, 50, sy);
  doc.setTextColor(6, 182, 212);  doc.text(`Ongoing: ${ongoing}`, 90, sy);
  doc.setTextColor(...C.amber);   doc.text(`Planning: ${planning}`, 128, sy);
  doc.setTextColor(...C.primary); doc.text(`Avg: ${avg}%`, 165, sy);

  autoTable(doc, {
    startY: startY + 18,
    head: [["No", "Program Kerja", "Kategori", "Ketua", "Target", "Progress", "Status"]],
    body: proker.map((p, i) => [
      i + 1, p.name, p.category, p.ketua_pelaksana, p.target, `${p.progress}%`, p.status,
    ]),
    ...tableStyles,
    styles: { ...tableStyles.styles, fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { cellWidth: 22 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
    },
  });

  addFooter(doc, W);
  doc.save(`ProKer_KKN146_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Keuangan PDF ────────────────────────────────────────── */
export async function exportKeuanganPDF(transactions: TransactionRow[]) {
  const { doc, startY, W } = await makePDF(
    "Laporan Keuangan KKN 146",
    "Desa Talang Marap · Kec. Kelam Tengah · Kab. Kaur · Bengkulu"
  );
  const autoTable = (await import("jspdf-autotable")).default;

  const income  = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  // 3 summary boxes
  const boxW = (W - 30) / 3;
  const boxes: { label: string; value: string; color: RGB }[] = [
    { label: "Total Pemasukan",   value: formatRp(income),   color: C.primary },
    { label: "Total Pengeluaran", value: formatRp(expense),  color: C.red },
    { label: "Saldo",             value: formatRp(balance),  color: C.secondary },
  ];
  boxes.forEach((box, i) => {
    const x = 10 + i * (boxW + 5);
    doc.setFillColor(...C.card);
    doc.roundedRect(x, startY - 4, boxW, 20, 2, 2, "F");
    doc.setFillColor(...box.color);
    doc.roundedRect(x, startY - 4, 3, 20, 1, 1, "F");
    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    doc.text(box.label, x + 6, startY + 2);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.white);
    doc.text(box.value, x + 6, startY + 11);
    doc.setFont("helvetica", "normal");
  });

  autoTable(doc, {
    startY: startY + 24,
    head: [["No", "Tanggal", "Deskripsi", "Kategori", "Tipe", "Jumlah (Rp)"]],
    body: transactions.map((t, i) => [
      i + 1, fmtDate(t.date), t.description, t.category,
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      formatRp(t.amount),
    ]),
    ...tableStyles,
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 28 },
      2: { cellWidth: 60 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22 },
      5: { cellWidth: 35, halign: "right" },
    },
  });

  addFooter(doc, W);
  doc.save(`Keuangan_KKN146_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Inventaris PDF ──────────────────────────────────────── */
export async function exportInventarisPDF(items: InventoryItem[]) {
  const { doc, startY, W } = await makePDF(
    "Daftar Inventaris KKN 146",
    "Desa Talang Marap · Kec. Kelam Tengah · Kab. Kaur · Bengkulu"
  );
  const autoTable = (await import("jspdf-autotable")).default;

  const checked = items.filter((i) => i.checked).length;
  doc.setFillColor(...C.card);
  doc.roundedRect(10, startY - 4, W - 20, 14, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(`Total Item: ${items.length}`, 16, startY + 4);
  doc.setTextColor(...C.primary);
  doc.text(`Sudah Dicek: ${checked} (${Math.round((checked / items.length) * 100)}%)`, 70, startY + 4);

  autoTable(doc, {
    startY: startY + 16,
    head: [["No", "Nama Item", "Kategori", "Jumlah", "Satuan", "Pemilik", "Status", "✓"]],
    body: items.map((item, i) => [
      i + 1, item.name, item.category, item.quantity, item.unit,
      item.owner ?? "-", item.status, item.checked ? "✓" : "○",
    ]),
    ...tableStyles,
    styles: { ...tableStyles.styles, fontSize: 7.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 50 },
      2: { cellWidth: 22 },
      3: { cellWidth: 14 },
      4: { cellWidth: 14 },
      5: { cellWidth: 30 },
      6: { cellWidth: 20 },
      7: { cellWidth: 10, halign: "center" },
    },
  });

  addFooter(doc, W);
  doc.save(`Inventaris_KKN146_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Absensi PDF ─────────────────────────────────────────── */
export async function exportAbsensiPDF(
  attendance: { name: string; date: string; status: string; note?: string | null }[],
  dateLabel?: string
) {
  const { doc, startY, W } = await makePDF(
    "Laporan Absensi KKN 146",
    dateLabel ? `Tanggal: ${dateLabel}` : "Desa Talang Marap"
  );
  const autoTable = (await import("jspdf-autotable")).default;

  const counts = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
  attendance.forEach((a) => {
    if (a.status in counts) counts[a.status as keyof typeof counts]++;
  });

  doc.setFillColor(...C.card);
  doc.roundedRect(10, startY - 4, W - 20, 14, 2, 2, "F");
  doc.setFontSize(8);
  const sy = startY + 4;
  doc.setTextColor(...C.primary); doc.text(`Hadir: ${counts.hadir}`,  16,  sy);
  doc.setTextColor(...C.amber);   doc.text(`Izin: ${counts.izin}`,    55,  sy);
  doc.setTextColor(...C.blue);    doc.text(`Sakit: ${counts.sakit}`,  90,  sy);
  doc.setTextColor(...C.red);     doc.text(`Alpha: ${counts.alpha}`,  128, sy);

  autoTable(doc, {
    startY: startY + 16,
    head: [["No", "Nama Anggota", "Tanggal", "Status", "Keterangan"]],
    body: attendance.map((a, i) => [
      i + 1, a.name, fmtDate(a.date), a.status.toUpperCase(), a.note ?? "-",
    ]),
    ...tableStyles,
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { cellWidth: 35 },
      3: { cellWidth: 22 },
      4: { cellWidth: 55 },
    },
  });

  addFooter(doc, W);
  doc.save(`Absensi_KKN146_${new Date().toISOString().slice(0, 10)}.pdf`);
}
