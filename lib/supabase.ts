import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Column {
  id: string;
  name: string;
  position: number;
  status_key: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  column_id: string;
  assignee: string | null;
  notes: string | null;
  position: number;
  priority: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions
export async function fetchColumns(): Promise<Column[]> {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .order("position");
  
  if (error) throw error;
  return data || [];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position");
  
  if (error) throw error;
  return data || [];
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// Token Usage Types
export interface TokenUsage {
  id: string;
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  total_tokens: number;
  cost_usd: number;
  recorded_at: string;
}

export async function fetchUsageByDateRange(startDate: string, endDate: string): Promise<TokenUsage[]> {
  const { data, error } = await supabase
    .from("token_usage")
    .select("*")
    .gte("recorded_at", startDate)
    .lte("recorded_at", endDate)
    .order("recorded_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}
