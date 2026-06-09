"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  StickyNote,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useAttendance, useUpsertAttendance, useDeleteAttendance } from "@/hooks/useAttendance";
import { members as seedMembers } from "@/data/members";
import { exportAbsensiPDF, exportAbsensiExcel } from "@/lib/export";
import type { MemberRow } from "@/types/database";

/* ─── styles ─────────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: "#111b2e",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 13,
  outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
};
const btnPrimary: React.CSSProperties = {
  padding: "10px 18px",
  background: "linear-gradient(to right, #10b981, #06b6d4)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};
const btnGhost: React.CSSProperties = {
  padding: "10px 18px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#94a3b8",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};
const btnDanger: React.CSSProperties = {
  padding: "10px 18px",
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.2)",
  color: "#f87171",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

/* ─── types ──────────────────────────────────────────────── */
type Status = "hadir" | "izin" | "sakit" | "alpha";

const STATUS_CFG: Record<Status, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  hadir: { label: "Hadir", color: "#34d399", icon: CheckCircle2 },
  izin:  { label: "Izin",  color: "#fbbf24", icon: Clock },
  sakit: { label: "Sakit", color: "#60a5fa", icon: AlertCircle },
  alpha: { label: "Alpha", color: "#f87171", icon: XCircle },
};

/* ─── helpers ────────────────────────────────────────────── */
function fmtDate(d: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d + "T00:00:00"));
}

function fmtShort(d: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(
    new Date(d + "T00:00:00")
  );
}

function addDays(d: string, n: number) {
  const dt = new Date(d + "T00:00:00");
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
}

function getLast7Days(from: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(from, -(6 - i)));
}

/* ─── Note modal ─────────────────────────────────────────── */
interface NoteModalProps {
  member: MemberRow;
  note: string;
  onSave: (note: string) => void;
  onClose: () => void;
}
function NoteModal({ member, note, onSave, onClose }: NoteModalProps) {
  const [val, setVal] = useState(note);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{ ...card, padding: 24, width: "100%", maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Catatan Kehadiran</p>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{member.name}</p>
          </div>
          <button onClick={onClose} style={{ ...btnGhost, padding: "6px 10px" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <label style={labelStyle}>Keterangan / Catatan</label>
        <textarea
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Masukkan catatan (opsional)..."
          style={{ ...inputStyle, height: 100, resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btnGhost}>Batal</button>
          <button onClick={() => { onSave(val); onClose(); }} style={btnPrimary}>
            <CheckCircle2 style={{ width: 14, height: 14 }} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function AbsensiPage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [noteModal, setNoteModal] = useState<MemberRow | null>(null);
  /* local override: notes typed but not yet saved — keyed by memberId */
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});

  /* Filter rentang tanggal untuk export */
  const [showRangeFilter, setShowRangeFilter] = useState(false);
  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd]     = useState(today);
  const [exportFormat, setExportFormat] = useState<"pdf"|"excel">("pdf");

  const { data: dbMembers } = useMembers();
  const allMembers = ((dbMembers ?? seedMembers) as unknown as MemberRow[]).filter(Boolean);

  const { data: dbAttendance = [], isLoading } = useAttendance(date);
  const { data: weekData = [] } = useAttendance(); // all records for weekly rekap
  const upsert = useUpsertAttendance();
  const del = useDeleteAttendance();

  /* Build a map: memberId -> AttendanceRow for the current date */
  const savedMap = Object.fromEntries(dbAttendance.map((r) => [r.member_id, r]));

  /* Optimistic local status override for instant UI feedback */
  const [localStatus, setLocalStatus] = useState<Record<string, Status>>({});

  /* Reset local overrides when date changes */
  useEffect(() => { setLocalStatus({}); setPendingNotes({}); }, [date]);

  function getStatus(id: string): Status {
    if (localStatus[id]) return localStatus[id];
    return (savedMap[id]?.status as Status) ?? "hadir";
  }

  function getNote(id: string): string {
    if (pendingNotes[id] !== undefined) return pendingNotes[id];
    return savedMap[id]?.note ?? "";
  }

  async function handleStatus(member: MemberRow, status: Status) {
    setLocalStatus((p) => ({ ...p, [member.id]: status }));
    await upsert.mutateAsync({
      member_id: member.id,
      member_name: member.name,
      date,
      status,
      note: getNote(member.id) || null,
    });
  }

  async function handleSaveNote(member: MemberRow, note: string) {
    setPendingNotes((p) => ({ ...p, [member.id]: note }));
    await upsert.mutateAsync({
      member_id: member.id,
      member_name: member.name,
      date,
      status: getStatus(member.id),
      note: note || null,
    });
  }

  async function handleDelete(id: string) {
    const row = savedMap[id];
    if (!row) return;
    setLocalStatus((p) => { const n = { ...p }; delete n[id]; return n; });
    await del.mutateAsync(row.id);
  }

  const counts = (Object.keys(STATUS_CFG) as Status[]).reduce(
    (a, s) => { a[s] = allMembers.filter((m) => getStatus(m.id) === s).length; return a; },
    {} as Record<Status, number>
  );

  /* Weekly rekap: last 7 days */
  const last7 = getLast7Days(date);
  const weekMap: Record<string, Record<string, Status>> = {};
  weekData.forEach((r) => {
    if (!weekMap[r.member_id]) weekMap[r.member_id] = {};
    weekMap[r.member_id][r.date] = r.status as Status;
  });

  async function handleExport() {
    const rows = allMembers.map((m) => ({
      name: m.name,
      date,
      status: getStatus(m.id),
      note: getNote(m.id) || null,
    }));
    await exportAbsensiPDF(rows, fmtDate(date));
  }

  async function handleRangeExport() {
    // Filter semua data yang ada dalam rentang tanggal
    const filtered = weekData
      .filter((r) => r.date >= rangeStart && r.date <= rangeEnd)
      .map((r) => ({
        name: r.member_name,
        date: r.date,
        status: r.status,
        note: r.note,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (filtered.length === 0) {
      alert("Tidak ada data absensi pada rentang tanggal tersebut.");
      return;
    }

    const label = `${fmtDate(rangeStart)} s/d ${fmtDate(rangeEnd)}`;
    if (exportFormat === "pdf") {
      await exportAbsensiPDF(filtered, label);
    } else {
      await exportAbsensiExcel(filtered);
    }
    setShowRangeFilter(false);
  }

  return (
    <div style={{ maxWidth: 960, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ ...card, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardList style={{ width: 20, height: 20, color: "#34d399" }} /> Absensi
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Rekap kehadiran anggota KKN 146</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleExport} style={btnGhost}>
            <Download style={{ width: 14, height: 14 }} /> Export Hari Ini
          </button>
          <button onClick={() => { setRangeStart(today); setRangeEnd(today); setShowRangeFilter(true); }} style={btnPrimary}>
            <Calendar style={{ width: 14, height: 14 }} /> Export Rentang
          </button>
        </div>
      </div>

      {/* Range Export Modal */}
      {showRangeFilter && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
          onClick={() => setShowRangeFilter(false)}>
          <div style={{ ...card, padding:24, width:"100%", maxWidth:420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <p style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Export Absensi</p>
                <p style={{ color:"#64748b", fontSize:12, marginTop:2 }}>Pilih rentang tanggal</p>
              </div>
              <button onClick={() => setShowRangeFilter(false)} style={{ ...btnGhost, padding:"6px 10px" }}>
                <X style={{ width:14, height:14 }} />
              </button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={labelStyle}>Dari Tanggal</label>
                  <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)}
                    style={inputStyle} max={rangeEnd} />
                </div>
                <div>
                  <label style={labelStyle}>Sampai Tanggal</label>
                  <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)}
                    style={inputStyle} min={rangeStart} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Format</label>
                <div style={{ display:"flex", gap:8 }}>
                  {(["pdf","excel"] as const).map(fmt => (
                    <button key={fmt} type="button" onClick={() => setExportFormat(fmt)}
                      style={{ flex:1, padding:"10px 0", borderRadius:10, border:"1px solid", cursor:"pointer", fontSize:13, fontWeight:600,
                        background: exportFormat===fmt ? (fmt==="pdf"?"rgba(239,68,68,0.1)":"rgba(16,185,129,0.1)") : "transparent",
                        color: exportFormat===fmt ? (fmt==="pdf"?"#f87171":"#34d399") : "#94a3b8",
                        borderColor: exportFormat===fmt ? (fmt==="pdf"?"rgba(239,68,68,0.3)":"rgba(16,185,129,0.3)") : "rgba(255,255,255,0.06)",
                      }}>
                      {fmt === "pdf" ? "📄 PDF" : "📊 Excel"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color:"#94a3b8", fontSize:12 }}>
                  Data yang diexport: semua absensi yang tercatat dari <span style={{ color:"#34d399" }}>{fmtDate(rangeStart)}</span> s/d <span style={{ color:"#34d399" }}>{fmtDate(rangeEnd)}</span>
                </p>
              </div>

              <div style={{ display:"flex", gap:12, paddingTop:4 }}>
                <button onClick={handleRangeExport}
                  style={{ ...btnPrimary, flex:1, justifyContent:"center" }}>
                  <Download style={{ width:14, height:14 }} /> Download {exportFormat.toUpperCase()}
                </button>
                <button onClick={() => setShowRangeFilter(false)} style={btnGhost}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date nav */}
      <div style={{ ...card, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setDate(addDays(date, -1))} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{fmtDate(date)}</p>
          {date === today && <p style={{ color: "#34d399", fontSize: 11, marginTop: 2 }}>Hari Ini</p>}
        </div>
        <button onClick={() => setDate(addDays(date, 1))} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {(Object.entries(STATUS_CFG) as [Status, (typeof STATUS_CFG)[Status]][]).map(([key, cfg]) => (
          <div key={key} style={{ ...card, padding: 16, textAlign: "center", borderColor: `${cfg.color}25`, background: `${cfg.color}08` }}>
            <cfg.icon style={{ width: 20, height: 20, color: cfg.color, margin: "0 auto 8px" }} />
            <p style={{ color: cfg.color, fontWeight: 700, fontSize: 22 }}>{counts[key]}</p>
            <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Member list */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardList style={{ width: 16, height: 16, color: "#34d399" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Daftar Hadir</span>
          </div>
          {isLoading && <Loader2 style={{ width: 14, height: 14, color: "#64748b", animation: "spin 1s linear infinite" }} />}
        </div>

        {allMembers.map((m, i) => {
          const current = getStatus(m.id);
          const isSaved = !!savedMap[m.id];
          const note = getNote(m.id);
          const cfg = STATUS_CFG[current];
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                borderBottom: i < allMembers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                    {m.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  {isSaved && (
                    <span style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, borderRadius: "50%", background: cfg.color, border: "2px solid #0d1526" }} />
                  )}
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{m.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ color: "#64748b", fontSize: 11 }}>{m.role}</p>
                    {note && (
                      <span style={{ color: "#fbbf24", fontSize: 10, display: "flex", alignItems: "center", gap: 3 }}>
                        <StickyNote style={{ width: 10, height: 10 }} /> {note.slice(0, 20)}{note.length > 20 ? "…" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {(Object.entries(STATUS_CFG) as [Status, (typeof STATUS_CFG)[Status]][]).map(([key, scfg]) => (
                  <button
                    key={key}
                    onClick={() => handleStatus(m, key)}
                    disabled={upsert.isPending}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: current === key ? `${scfg.color}15` : "rgba(255,255,255,0.03)",
                      color: current === key ? scfg.color : "#64748b",
                      borderColor: current === key ? `${scfg.color}30` : "rgba(255,255,255,0.06)",
                      opacity: upsert.isPending ? 0.6 : 1,
                    }}
                  >
                    <scfg.icon style={{ width: 12, height: 12 }} />
                    {scfg.label}
                  </button>
                ))}
                {/* Note button */}
                <button
                  onClick={() => setNoteModal(m)}
                  title="Tambah catatan"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: note ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${note ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: note ? "#fbbf24" : "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText style={{ width: 12, height: 12 }} />
                </button>
                {/* Delete saved record */}
                {isSaved && (
                  <button
                    onClick={() => handleDelete(m.id)}
                    title="Hapus record"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      color: "#f87171",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <XCircle style={{ width: 12, height: 12 }} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rekap Mingguan */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Rekap 7 Hari Terakhir</p>
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
            {fmtShort(last7[0])} — {fmtShort(last7[6])}
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>Anggota</th>
                {last7.map((d) => (
                  <th key={d} style={{ padding: "10px 10px", textAlign: "center", color: d === date ? "#34d399" : "#64748b", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {fmtShort(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allMembers.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: i < allMembers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "10px 16px", color: "#fff", fontSize: 12, whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</td>
                  {last7.map((d) => {
                    const s: Status = (weekMap[m.id]?.[d] as Status) ?? null;
                    const cfg = s ? STATUS_CFG[s] : null;
                    return (
                      <td key={d} style={{ padding: "10px 10px", textAlign: "center" }}>
                        {cfg ? (
                          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, background: `${cfg.color}15`, color: cfg.color, fontSize: 10, fontWeight: 600 }}>
                            {cfg.label[0]}
                          </span>
                        ) : (
                          <span style={{ color: "#334155", fontSize: 12 }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note modal */}
      {noteModal && (
        <NoteModal
          member={noteModal}
          note={getNote(noteModal.id)}
          onSave={(note) => handleSaveNote(noteModal, note)}
          onClose={() => setNoteModal(null)}
        />
      )}

      {/* spin keyframe injection */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
