"use client";

import { useState } from "react";
import { useKanban } from "./KanbanContext";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Ergon" }: HeaderProps) {
  const { tasks, columns } = useKanban();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Calculate stats
  const inProgressColumn = columns.find(c => c.status_key === "progress");
  const jasonColumn = columns.find(c => c.status_key === "jason");
  const jcColumn = columns.find(c => c.status_key === "jc");

  const inProgressCount = inProgressColumn 
    ? tasks.filter(t => t.column_id === inProgressColumn.id).length 
    : 0;
  const needsActionCount = (jasonColumn ? tasks.filter(t => t.column_id === jasonColumn.id).length : 0) +
    (jcColumn ? tasks.filter(t => t.column_id === jcColumn.id).length : 0);

  return (
    <>
      <header className="flex justify-between items-center px-8 py-5 border-b border-border bg-background h-header">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-[#1e3d29] rounded-lg flex items-center justify-center font-semibold text-sm text-accent-light">
            E
          </div>
          <span className="text-xl font-semibold text-text tracking-tight">{title}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="bg-surface-hover px-3 py-1.5 rounded-md text-xs text-text-subtle">
              <span className="text-text font-medium mr-1">{inProgressCount}</span>
              in progress
            </div>
            <div className="bg-surface-hover px-3 py-1.5 rounded-md text-xs text-text-subtle">
              <span className="text-text font-medium mr-1">{needsActionCount}</span>
              need action
            </div>
          </div>

          {/* Filter Button */}
          <button className="px-4 py-2 bg-transparent text-text-muted border border-[#333] rounded-lg text-sm font-medium hover:bg-surface-hover hover:text-text transition-all duration-150">
            Filter
          </button>

          {/* New Task Button */}
          <button 
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-accent text-text rounded-lg text-sm font-medium hover:bg-accent-hover transition-all duration-150"
          >
            + New Task
          </button>
        </div>
      </header>

      {/* New Task Modal */}
      <Modal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        title="New Task"
      >
        <TaskForm
          onSuccess={() => setShowNewTaskModal(false)}
          onCancel={() => setShowNewTaskModal(false)}
        />
      </Modal>
    </>
  );
}
