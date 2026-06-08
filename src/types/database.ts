export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          nim: string;
          division: string;
          role: string;
          faculty: string;
          prodi: string;
          gender: string;
          quote: string | null;
          instagram: string | null;
          whatsapp: string | null;
          photo_url: string | null;
          color: string;
          initials: string;
          dpl: string | null;
          dpl_photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["members"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      proker: {
        Row: {
          id: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["proker"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["proker"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          type: "income" | "expense";
          description: string;
          amount: number;
          date: string;
          category: string;
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      journal: {
        Row: {
          id: string;
          date: string;
          title: string;
          content: string;
          priority: "low" | "medium" | "high";
          tags: string[];
          author: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["journal"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["journal"]["Insert"]>;
      };
      attendance: {
        Row: {
          id: string;
          member_id: string;
          member_name: string;
          date: string;
          status: "hadir" | "izin" | "sakit" | "alpha";
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendance"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
      };
    };
  };
}

// Convenience types
export type MemberRow       = Database["public"]["Tables"]["members"]["Row"];
export type MemberInsert    = Database["public"]["Tables"]["members"]["Insert"];
export type MemberUpdate    = Database["public"]["Tables"]["members"]["Update"];

export type ProkerRow       = Database["public"]["Tables"]["proker"]["Row"];
export type ProkerInsert    = Database["public"]["Tables"]["proker"]["Insert"];
export type ProkerUpdate    = Database["public"]["Tables"]["proker"]["Update"];

export type TransactionRow  = Database["public"]["Tables"]["transactions"]["Row"];
export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];

export type JournalRow      = Database["public"]["Tables"]["journal"]["Row"];
export type JournalInsert   = Database["public"]["Tables"]["journal"]["Insert"];

export type AttendanceRow   = Database["public"]["Tables"]["attendance"]["Row"];
export type AttendanceInsert = Database["public"]["Tables"]["attendance"]["Insert"];
