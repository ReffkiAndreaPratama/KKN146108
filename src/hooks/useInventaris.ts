"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { InventarisRow } from "@/types/database";

const KEY = ["inventaris"];

export interface InventarisPayload {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  owner?: string | null;
  status: "tersedia" | "kurang" | "tidak_ada";
  checked: boolean;
}

export function useInventaris() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("inventaris").select("*").order("category").order("name");
      if (error) throw error;
      return (data ?? []) as InventarisRow[];
    },
  });
}

export function useCreateInventaris() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InventarisPayload) => {
      const { data, error } = await supabase.from("inventaris").insert(payload as never).select().single();
      if (error) throw error;
      return data as InventarisRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateInventaris() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: InventarisPayload & { id: string }) => {
      const { data, error } = await supabase.from("inventaris").update(payload as never).eq("id", id).select().single();
      if (error) throw error;
      return data as InventarisRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteInventaris() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inventaris").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
