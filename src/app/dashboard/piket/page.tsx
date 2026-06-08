"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Wand2,
  X,
  Loader2,
  ListChecks,
  Save,
} from "lucide-react";
import { addDays, format, startOfWeek } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useMembers } from "@/hooks/useMembers";
import { usePiket, useUpsertPiket, useDeletePiket } from "@/hooks/usePiket";
import { members as seedMembers } from "@/data/members";
import type { MemberRow, PiketRow } from "@/types/database";

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
  boxSizing: "border-box",
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

/* ─── Default tasks list ─────────────────────────────────── */
const DEFAULT_TASKS = [
  "Masak pagi & malam",
  "Bersih-bersih posko",
  "Cuci piring",
  "Belanja kebutuhan",
  "Jaga posko siang",
];

/* ─── Piket Edit Modal ───────────────────────────────────── */
interface PiketModalProps {
  dateStr: string;
  existing: PiketRow | null;
  allMembers: MemberRow[];
  defaultTasks: string[];
  onSave: (payload: {
    date: string;
    members: string[];
    tasks: string[];
    completed: boolean;
    note: string | null;
  }) => Promise<void>;
  onClose: () => void;
}

function PiketModal({ dateStr, existing, allMembers, defaultTasks, onSave, onClose }: PiketModalProps) {
  const [selMembers, setSelMembers] = useState<string[]>(existing?.members ?? []);
  const [tasks, setTasks] = useState<string>(existing?.tasks.join(", ") ?? defaultTasks.join(", "));
  const [note, setNote] = useState(existing?.note ?? "");
  const [completed, setCompleted] = useState(existing?.completed ?? false);
  const [saving, setSaving] = useState(false);

  function toggleMember(name: string) {
    setSelMembers((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await onSave({
        date: dateStr,
        members: selMembers,
        tasks: tasks.split(",").map((t) => t.trim()).filter(Boolean),
        completed,
        note: note.trim() || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const fmtLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr + "T00:00:00"));

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div style={{ ...card, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{existing ? "Edit Piket" : "Tambah Piket"}</p>
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{fmtLabel}</p>
          </div>
          <button onClick={onClose} style={{ ...btnGhost, padding: "6px 10px" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Members */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Petugas Piket</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {allMembers.map((m) => {
              const checked = selMembers.includes(m.name);
              return (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, border: `1px solid ${checked ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`, background: checked ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMember(m.name)} style={{ accentColor: "#10b981" }} />
                  <span style={{ color: "#fff", fontSize: 12 }}>{m.name.split(" ")[0]}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Tugas Piket <span style={{ color: "#475569", fontWeight: 400, textTransform: "none" }}>(pisahkan dengan koma)</span></label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Masak, Bersih-bersih, ..."
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
          />
        </div>

        {/* Note */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Catatan (opsional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan tambahan..." style={inputStyle} />
        </div>

        {/* Completed toggle */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div
              onClick={() => setCompleted((p) => !p)}
              style={{ width: 40, height: 22, borderRadius: 99, background: completed ? "#10b981" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s", cursor: "pointer" }}
            >
              <div style={{ position: "absolute", top: 3, left: completed ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
            <span style={{ color: "#fff", fontSize: 13 }}>Tandai Selesai</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btnGhost}>Batal</button>
          <button onClick={handleSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 style={{ width: 14, height: 14 }} /> : <Save style={{ width: 14, height: 14 }} />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Task CRUD at bottom ────────────────────────────────── */
function TasksManager({ tasks, onChange }: { tasks: string[]; onChange: (t: string[]) => void }) {
  const [newTask, setNewTask] = useState("");

  function add() {
    const t = newTask.trim();
    if (!t || tasks.includes(t)) return;
    onChange([...tasks, t]);
    setNewTask("");
  }

  function remove(t: string) {
    onChange(tasks.filter((x) => x !== t));
  }

  return (
    <div style={{ ...card, padding: 24 }}>
      <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <ListChecks style={{ width: 16, height: 16, color: "#34d399" }} /> Daftar Tugas Piket
        <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>(template default)</span>
      </h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Tugas baru..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={add} style={btnPrimary}>
          <Plus style={{ width: 14, height: 14 }} /> Tambah
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {tasks.map((task, i) => (
          <div key={task} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(16,185,129,0.1)", color: "#34d399", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>{task}</span>
            </div>
            <button onClick={() => remove(task)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X style={{ width: 11, height: 11 }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function PiketPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [modal, setModal] = useState<{ dateStr: string; existing: PiketRow | null } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // piket id
  const [tasksList, setTasksList] = useState<string[]>(DEFAULT_TASKS);

  const { data: dbMembers } = useMembers();
  const allMembers = ((dbMembers ?? seedMembers) as unknown as MemberRow[]).filter(Boolean);

  const { data: piketData = [], isLoading } = usePiket();
  const upsert = useUpsertPiket();
  const del = useDeletePiket();

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const todayStr = format(new Date(), "yyyy-MM-dd");

  /* Build dateStr -> PiketRow map */
  const piketMap: Record<string, PiketRow> = Object.fromEntries(piketData.map((p) => [p.date, p]));

  /* Week days */
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return format(d, "yyyy-MM-dd");
  });

  /* Auto-generate schedule for the week (only days without existing data) */
  function generateSchedule() {
    weekDays.forEach((dateStr, i) => {
      if (piketMap[dateStr]) return; // skip existing
      const m1 = allMembers[i % allMembers.length];
      const m2 = allMembers[(i + 1) % allMembers.length];
      const memberNames = [m1, m2].filter(Boolean).map((m) => m.name);
      upsert.mutate({
        date: dateStr,
        members: memberNames,
        tasks: tasksList,
        completed: false,
        note: null,
      });
    });
  }

  async function handleSave(payload: { date: string; members: string[]; tasks: string[]; completed: boolean; note: string | null }) {
    await upsert.mutateAsync(payload);
  }

  async function handleToggleDone(dateStr: string) {
    const existing = piketMap[dateStr];
    if (!existing) return;
    await upsert.mutateAsync({
      date: dateStr,
      members: existing.members,
      tasks: existing.tasks,
      completed: !existing.completed,
      note: existing.note,
    });
  }

  async function handleDelete(id: string) {
    await del.mutateAsync(id);
    setDeleteConfirm(null);
  }

  return (
    <div style={{ maxWidth: 1100, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ ...card, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar style={{ width: 20, height: 20, color: "#34d399" }} /> Jadwal Piket
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Manajemen jadwal piket KKN 146</p>
        </div>
        <button onClick={generateSchedule} disabled={upsert.isPending} style={{ ...btnPrimary, opacity: upsert.isPending ? 0.7 : 1 }}>
          {upsert.isPending ? <Loader2 style={{ width: 14, height: 14 }} /> : <Wand2 style={{ width: 14, height: 14 }} />}
          Generate Otomatis
        </button>
      </div>

      {/* Week nav */}
      <div style={{ ...card, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setWeekOffset((w) => w - 1)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
            {format(weekStart, "d MMMM", { locale: localeId })} — {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: localeId })}
          </p>
          {weekOffset === 0 && <p style={{ color: "#34d399", fontSize: 11, marginTop: 2 }}>Minggu Ini</p>}
        </div>
        <button onClick={() => setWeekOffset((w) => w + 1)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Loader2 style={{ width: 20, height: 20, color: "#34d399", margin: "0 auto", animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {/* Schedule grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {weekDays.map((dateStr, i) => {
          const isToday = dateStr === todayStr;
          const entry = piketMap[dateStr] ?? null;
          const isDone = entry?.completed ?? false;
          const dayLabel = format(addDays(weekStart, i), "EEEE", { locale: localeId });
          const dateLabel = format(addDays(weekStart, i), "d MMM yyyy", { locale: localeId });

          return (
            <div
              key={dateStr}
              style={{
                ...card,
                padding: 20,
                borderColor: isToday ? "rgba(16,185,129,0.3)" : isDone ? "rgba(16,185,129,0.15)" : undefined,
                background: isToday ? "rgba(16,185,129,0.05)" : "#111b2e",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Day header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: isToday ? "#34d399" : "#fff", fontWeight: 700, fontSize: 13 }}>{dayLabel}</p>
                  <p style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{dateLabel}</p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {isToday && (
                    <span style={{ padding: "2px 8px", borderRadius: 99, background: "rgba(16,185,129,0.15)", color: "#34d399", fontSize: 10, fontWeight: 600 }}>
                      Hari Ini
                    </span>
                  )}
                  {isDone && (
                    <span style={{ padding: "2px 8px", borderRadius: 99, background: "rgba(16,185,129,0.1)", color: "#34d399", fontSize: 10, fontWeight: 600 }}>
                      ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Members */}
              {entry && entry.members.length > 0 ? (
                <div>
                  <p style={{ color: "#64748b", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Petugas</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {entry.members.map((name) => (
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#10b981,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                          {name[0]}
                        </div>
                        <span style={{ color: "#fff", fontSize: 12 }}>{name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: "#334155", fontSize: 12, fontStyle: "italic" }}>Belum ada petugas</p>
              )}

              {/* Tasks */}
              {entry && entry.tasks.length > 0 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Tugas</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {entry.tasks.slice(0, 3).map((t) => (
                      <span key={t} style={{ color: "#64748b", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#334155", flexShrink: 0, display: "inline-block" }} />
                        {t}
                      </span>
                    ))}
                    {entry.tasks.length > 3 && (
                      <span style={{ color: "#475569", fontSize: 10 }}>+{entry.tasks.length - 3} lainnya</span>
                    )}
                  </div>
                </div>
              )}

              {/* Note */}
              {entry?.note && (
                <p style={{ color: "#fbbf24", fontSize: 11, fontStyle: "italic" }}>📝 {entry.note}</p>
              )}

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "auto" }}>
                {/* Toggle selesai (only if entry exists) */}
                {entry && (
                  <button
                    onClick={() => handleToggleDone(dateStr)}
                    disabled={upsert.isPending}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      background: isDone ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                      color: isDone ? "#34d399" : "#64748b",
                      borderColor: isDone ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <CheckCircle2 style={{ width: 12, height: 12 }} />
                    {isDone ? "Selesai" : "Tandai Selesai"}
                  </button>
                )}

                <div style={{ display: "flex", gap: 4 }}>
                  {/* Edit/Add */}
                  <button
                    onClick={() => setModal({ dateStr, existing: entry })}
                    style={{
                      flex: 1,
                      padding: "7px 0",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    {entry ? <Edit2 style={{ width: 11, height: 11 }} /> : <Plus style={{ width: 11, height: 11 }} />}
                    {entry ? "Edit" : "Tambah"}
                  </button>

                  {/* Delete */}
                  {entry && (
                    <button
                      onClick={() => setDeleteConfirm(entry.id)}
                      style={{
                        width: 32,
                        padding: "7px 0",
                        borderRadius: 8,
                        border: "1px solid rgba(239,68,68,0.15)",
                        background: "rgba(239,68,68,0.06)",
                        color: "#f87171",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 style={{ width: 11, height: 11 }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks manager */}
      <TasksManager tasks={tasksList} onChange={setTasksList} />

      {/* Edit/Add modal */}
      {modal && (
        <PiketModal
          dateStr={modal.dateStr}
          existing={modal.existing}
          allMembers={allMembers}
          defaultTasks={tasksList}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div style={{ ...card, padding: 28, width: "100%", maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Hapus Jadwal Piket?</p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnGhost}>Batal</button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={del.isPending}
                style={{ ...btnDanger, opacity: del.isPending ? 0.7 : 1 }}
              >
                {del.isPending ? <Loader2 style={{ width: 14, height: 14 }} /> : <Trash2 style={{ width: 14, height: 14 }} />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
