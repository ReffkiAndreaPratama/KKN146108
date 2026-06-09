"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { ArsipRow } from "@/types/database";

const KEY = ["arsip"];

const rawClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

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
      const { data, error } = await rawClient.from("arsip").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ArsipRow[];
    },
  });
}

export function useCreateArsip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ArsipPayload) => {
      const { data, error } = await rawClient.from("arsip").insert(payload).select().single();
      if (error) throw error;
      return data as ArsipRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateArsip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ArsipPayload & { id: string }) => {
      const { data, error } = await rawClient.from("arsip").update(payload).eq("id", id).select().single();
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
      const { error } = await rawClient.from("arsip").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
