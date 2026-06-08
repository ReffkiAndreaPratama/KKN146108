"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DokumentasiRow } from "@/types/database";

const KEY = ["dokumentasi"];

export interface DokumentasiPayload {
  title: string;
  category: string;
  date: string;
  photo_url?: string | null;
  description?: string | null;
  uploader: string;
}

export function useDokumentasi() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("dokumentasi").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DokumentasiRow[];
    },
  });
}

export function useCreateDokumentasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DokumentasiPayload) => {
      const clean = {
        ...payload,
        photo_url: payload.photo_url || null,
        description: payload.description || null,
      };
      const { data, error } = await supabase.from("dokumentasi").insert(clean).select().single();
      if (error) throw error;
      return data as DokumentasiRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateDokumentasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: DokumentasiPayload & { id: string }) => {
      const clean = {
        ...payload,
        photo_url: payload.photo_url || null,
        description: payload.description || null,
      };
      const { data, error } = await supabase.from("dokumentasi").update(clean).eq("id", id).select().single();
      if (error) throw error;
      return data as DokumentasiRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteDokumentasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dokumentasi").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
