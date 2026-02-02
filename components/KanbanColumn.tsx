"use client";

import { useState } from "react";
import { Column, Task } from "@/lib/supabase";
import TaskCard from "./TaskCard";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (statusKey: string | null) => {
    switch (statusKey) {
      case "backlog":
        return "text-status-backlog";
      case "progress":
        return "text-status-progress";
      case "jason":
        return "text-status-jason";
      case "jc":
        return "text-status-jc";
      case "done":
        return "text-status-done";
      default:
        return "text-text-subtle";
    }
  };

  const getStatusDot = (statusKey: string | null) => {
    switch (statusKey) {
      case "backlog":
        return "bg-[#555]";
      case "progress":
        return "bg-status-progress";
      case "jason":
        return "bg-status-jason";
      case "jc":
        return "bg-status-jc";
      case "done":
        return "bg-[#3d6b4a]";
      default:
        return "bg-text-disabled";
    }
  };

  return (
    <>
      <div className="w-column flex-shrink-0 bg-surface rounded-xl p-4 flex flex-col">
        {/* Column Header */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[13px] font-semibold uppercase tracking-wide flex items-center ${getStatusColor(column.status_key)}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(column.status_key)}`}></span>
            {column.name}
          </span>
          <span className="text-xs text-text-disabled bg-surface-secondary px-2 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Add Card Button */}
        <div 
          onClick={() => setShowAddModal(true)}
          className="mt-3 p-2.5 border border-dashed border-border-hover rounded-lg text-[13px] text-[#555] cursor-pointer text-center transition-all duration-150 hover:border-[#4a4a4a] hover:text-[#777] hover:bg-white/[0.02]"
        >
          + Add task
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Task"
      >
        <TaskForm
          defaultColumnId={column.id}
          onSuccess={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </>
  );
}
