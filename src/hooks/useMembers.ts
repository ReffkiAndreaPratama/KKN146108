"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MemberRow } from "@/types/database";

const QUERY_KEY = ["members"];

export interface MemberPayload {
  name: string;
  nim: string;
  division: string;
  role: string;
  faculty: string;
  prodi: string;
  gender: string;
  quote?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  photo_url?: string | null;
  color: string;
  initials: string;
  dpl?: string | null;
  dpl_photo_url?: string | null;
}

export function useMembers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MemberRow[];
    },
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as MemberRow;
    },
    enabled: !!id,
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MemberPayload) => {
      const { data, error } = await supabase
        .from("members")
        .insert(payload as never)
        .select()
        .single();
      if (error) throw error;
      return data as MemberRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: MemberPayload & { id: string }) => {
      const { data, error } = await supabase
        .from("members")
        .update(payload as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as MemberRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
