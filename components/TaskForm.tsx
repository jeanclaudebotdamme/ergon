"use client";

import { useState } from "react";
import { Task } from "@/lib/supabase";
import { useKanban } from "./KanbanContext";

interface TaskFormProps {
  task?: Task | null;
  defaultColumnId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ task, defaultColumnId, onSuccess, onCancel }: TaskFormProps) {
  const { columns, tasks, createTask, updateTask, deleteTask } = useKanban();
  const [title, setTitle] = useState(task?.title || "");
  const [notes, setNotes] = useState(task?.notes || "");
  const [columnId, setColumnId] = useState(task?.column_id || defaultColumnId || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [priority, setPriority] = useState(task?.priority || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !columnId) return;

    setIsSubmitting(true);
    try {
      if (task) {
        // Update existing task
        await updateTask(task.id, {
          title: title.trim(),
          notes: notes.trim() || null,
          column_id: columnId,
          assignee: assignee || null,
          priority,
        });
      } else {
        // Create new task
        // Calculate position as the last task in the column
        const columnTasks = tasks.filter((t) => t.column_id === columnId);
        const position = columnTasks.length > 0 
          ? Math.max(...columnTasks.map((t) => t.position)) + 1 
          : 0;

        await createTask({
          title: title.trim(),
          notes: notes.trim() || null,
          column_id: columnId,
          assignee: assignee || null,
          priority,
          position,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onSuccess();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text placeholder-text-disabled focus:outline-none focus:border-accent transition-colors"
          autoFocus
        />
      </div>

      {/* Column Select */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
          Column
        </label>
        <select
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">Select a column</option>
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee Select */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
          Assignee
        </label>
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">Unassigned</option>
          <option value="jason">Jason</option>
          <option value="jc">JC</option>
        </select>
      </div>

      {/* Notes Textarea */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={3}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text placeholder-text-disabled focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* Priority Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="priority"
          checked={priority}
          onChange={(e) => setPriority(e.target.checked)}
          className="w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent cursor-pointer"
        />
        <label htmlFor="priority" className="text-sm text-text cursor-pointer">
          Mark as priority
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {task && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-transparent text-red-400 border border-red-400/30 rounded-lg text-sm font-medium hover:bg-red-400/10 transition-all duration-150 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
        <div className="flex-1"></div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-transparent text-text-muted border border-border rounded-lg text-sm font-medium hover:bg-surface-hover hover:text-text transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !columnId}
          className="px-4 py-2 bg-accent text-text rounded-lg text-sm font-medium hover:bg-accent-hover transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : task ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
