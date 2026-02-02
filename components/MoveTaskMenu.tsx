"use client";

import { useState, useRef, useEffect } from "react";
import { useKanban } from "./KanbanContext";

interface MoveTaskMenuProps {
  taskId: string;
  currentColumnId: string;
  onMove?: () => void;
}

export default function MoveTaskMenu({ taskId, currentColumnId, onMove }: MoveTaskMenuProps) {
  const { columns, moveTask } = useKanban();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMove = async (newColumnId: string) => {
    if (newColumnId === currentColumnId) {
      setIsOpen(false);
      return;
    }

    setIsMoving(true);
    try {
      await moveTask(taskId, newColumnId);
      onMove?.();
    } catch (error) {
      console.error("Error moving task:", error);
    } finally {
      setIsMoving(false);
      setIsOpen(false);
    }
  };

  const availableColumns = columns.filter((col) => col.id !== currentColumnId);

  if (availableColumns.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isMoving}
        className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded transition-colors"
        title="Move to another column"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="5 9 2 12 5 15" />
          <polyline points="9 5 12 2 15 5" />
          <polyline points="15 19 12 22 9 19" />
          <polyline points="19 9 22 12 19 15" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-secondary border border-border rounded-lg shadow-xl z-10 py-1">
          <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide border-b border-border">
            Move to
          </div>
          {availableColumns.map((column) => (
            <button
              key={column.id}
              onClick={() => handleMove(column.id)}
              className="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-hover transition-colors"
            >
              {column.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
