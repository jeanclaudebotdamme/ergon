"use client";

import { Task } from "@/lib/supabase";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
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
    <div className="bg-surface-secondary rounded-xl p-3.5 px-4 cursor-pointer transition-all duration-150 border border-transparent hover:bg-surface-elevated hover:border-border-hover">
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
  );
}
