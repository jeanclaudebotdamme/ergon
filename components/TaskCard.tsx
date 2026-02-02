"use client";

import { useState } from "react";
import { Task } from "@/lib/supabase";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const getTagStyle = (assignee: string | null) => {
    switch (assignee) {
      case "jason":
        return "bg-tag-jason-bg text-tag-jason-text";
      case "jc":
        return "bg-tag-jc-bg text-tag-jc-text";
      default:
        return "bg-surface-secondary text-text-muted";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div 
        onClick={() => setShowEditModal(true)}
        className="bg-surface-secondary rounded-xl p-3.5 px-4 cursor-pointer transition-all duration-150 border border-transparent hover:bg-surface-elevated hover:border-border-hover"
      >
        <div className="text-sm font-medium mb-2 text-text">{task.title}</div>
        <div className="flex gap-2 items-center flex-wrap">
          {task.assignee && (
            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${getTagStyle(task.assignee)}`}>
              {task.assignee === "jason" ? "Jason" : "JC"}
            </span>
          )}
          {task.priority && (
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-tag-priority-bg text-tag-priority-text">
              Priority
            </span>
          )}
          <span className="text-[11px] text-text-disabled ml-auto">
            {formatDate(task.created_at)}
          </span>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
      >
        <TaskForm
          task={task}
          onSuccess={() => setShowEditModal(false)}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
}
