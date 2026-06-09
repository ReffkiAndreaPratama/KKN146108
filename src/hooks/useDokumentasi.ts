"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { DokumentasiRow } from "@/types/database";

const KEY = ["dokumentasi"];

// Untyped client khusus untuk insert/update dokumentasi
// (menghindari TypeScript inference issue dengan generic Database type)
const rawClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export interface DokumentasiPayload {
  title: string;
  category: string;
  date: string;
  photo_url?: string | null;
  description?: string | null;
  uploader: string;
}

function toClean(payload: DokumentasiPayload) {
  return {
    title: payload.title,
    category: payload.category,
    date: payload.date,
    photo_url: payload.photo_url || null,
    description: payload.description || null,
    uploader: payload.uploader,
  };
}

export function useDokumentasi() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await rawClient.from("dokumentasi").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DokumentasiRow[];
    },
  });
}

export function useCreateDokumentasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DokumentasiPayload) => {
      const { data, error } = await rawClient.from("dokumentasi").insert(toClean(payload)).select().single();
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
      const { data, error } = await rawClient.from("dokumentasi").update(toClean(payload)).eq("id", id).select().single();
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
      const { error } = await rawClient.from("dokumentasi").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
