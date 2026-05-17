"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProkerRow } from "@/types/database";

const QUERY_KEY = ["proker"];

export interface ProkerPayload {
  name: string;
  description: string;
  category: string;
  ketua_pelaksana: string;
  anggota: string[];
  start_date: string;
  end_date: string;
  target: string;
  progress: number;
  status: "planning" | "ongoing" | "completed";
}

export function useProker() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proker")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProkerRow[];
    },
  });
}

export function useCreateProker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProkerPayload) => {
      const { data, error } = await supabase
        .from("proker")
        .insert(payload as never)
        .select()
        .single();
      if (error) throw error;
      return data as ProkerRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateProker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ProkerPayload & { id: string }) => {
      const { data, error } = await supabase
        .from("proker")
        .update(payload as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ProkerRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteProker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("proker").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
