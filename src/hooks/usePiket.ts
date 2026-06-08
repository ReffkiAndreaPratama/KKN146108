"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PiketRow } from "@/types/database";

const KEY = ["piket"];

export interface PiketPayload {
  date: string;
  members: string[];
  tasks: string[];
  completed: boolean;
  note?: string | null;
}

export function usePiket() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("piket").select("*").order("date");
      if (error) throw error;
      return (data ?? []) as PiketRow[];
    },
  });
}

export function useUpsertPiket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PiketPayload) => {
      const { data, error } = await supabase
        .from("piket")
        .upsert(payload as never, { onConflict: "date" })
        .select()
        .single();
      if (error) throw error;
      return data as PiketRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeletePiket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("piket").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
