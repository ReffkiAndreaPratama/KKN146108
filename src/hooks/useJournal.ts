"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { JournalRow } from "@/types/database";

const QUERY_KEY = ["journal"];

export interface JournalPayload {
  date: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  author: string;
}

export function useJournal() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JournalRow[];
    },
  });
}

export function useCreateJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: JournalPayload) => {
      const { data, error } = await supabase
        .from("journal")
        .insert(payload as never)
        .select()
        .single();
      if (error) throw error;
      return data as JournalRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
