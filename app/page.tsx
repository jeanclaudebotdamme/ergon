"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KanbanColumn from "@/components/KanbanColumn";
import { Column, Task, fetchColumns, fetchTasks } from "@/lib/supabase";

export default function Home() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [columnsData, tasksData] = await Promise.all([
          fetchColumns(),
          fetchTasks(),
        ]);
        setColumns(columnsData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getTasksForColumn = (columnId: string) => {
    return tasks
      .filter((task) => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Ergon Dashboard" />
      
      <main className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        <Sidebar activeView="board" />
        
        <section className="flex-1 p-6 overflow-x-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              Ergon Dashboard
            </h1>
          </div>

          <div className="flex gap-4 h-[calc(100%-60px)]">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksForColumn(column.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
