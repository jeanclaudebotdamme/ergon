"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Column, Task, fetchColumns, fetchTasks, createTask as createTaskApi, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from "@/lib/supabase";

interface KanbanContextType {
  columns: Column[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createTask: (task: Omit<Task, "id" | "created_at" | "updated_at">) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newColumnId: string) => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [columnsData, tasksData] = await Promise.all([
        fetchColumns(),
        fetchTasks(),
      ]);
      setColumns(columnsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    try {
      const newTask = await createTaskApi(task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTaskApi(id, updates);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  }, []);

  const moveTask = useCallback(async (taskId: string, newColumnId: string) => {
    try {
      const updatedTask = await updateTaskApi(taskId, { column_id: newColumnId });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error moving task:", err);
      throw err;
    }
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        columns,
        tasks,
        loading,
        error,
        refreshData,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
