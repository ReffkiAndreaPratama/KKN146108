"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AttendanceRow } from "@/types/database";

const KEY = ["attendance"];

export interface AttendancePayload {
  member_id: string;
  member_name: string;
  date: string;
  status: "hadir" | "izin" | "sakit" | "alpha";
  note?: string | null;
}

export function useAttendance(date?: string) {
  return useQuery({
    queryKey: [...KEY, date],
    queryFn: async () => {
      let q = supabase.from("attendance").select("*").order("member_name");
      if (date) q = q.eq("date", date);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AttendanceRow[];
    },
    enabled: true,
  });
}

export function useUpsertAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AttendancePayload) => {
      const { data, error } = await supabase
        .from("attendance")
        .upsert(payload as never, { onConflict: "member_id,date" })
        .select()
        .single();
      if (error) throw error;
      return data as AttendanceRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("attendance").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
