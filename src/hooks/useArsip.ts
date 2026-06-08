"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ArsipRow } from "@/types/database";

const KEY = ["arsip"];

export interface ArsipPayload {
  name: string;
  category: string;
  file_url: string;
  file_type: string;
  size_bytes: number;
  uploader: string;
}

export function useArsip() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("arsip").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ArsipRow[];
    },
  });
}

export function useCreateArsip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ArsipPayload) => {
      const { data, error } = await supabase.from("arsip").insert(payload as never).select().single();
      if (error) throw error;
      return data as ArsipRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteArsip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("arsip").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
