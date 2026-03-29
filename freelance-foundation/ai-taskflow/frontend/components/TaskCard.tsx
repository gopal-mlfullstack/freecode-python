"use client";

import { useState } from "react";
import { deleteTask } from "@/lib/api";
import AISuggest from "./AISuggest";
import TaskForm from "./TaskForm";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  due_date?: string;
};

type Props = {
  task: Task;
  onRefresh: () => void;
};

// Priority → color mapping for the badge
const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function TaskCard({ task, onRefresh }: Props) {
  // Each card manages its own modal open/close state
  const [showEdit, setShowEdit] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;

    setDeleting(true);
    await deleteTask(task.id);

    onRefresh();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 flex-1 mr-2">
            {task.title}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>
          {task.due_date && (
            <span className="text-xs text-gray-400">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="flex-1 text-sm bg-gray-50 text-gray-600 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => setShowAI(true)}
            className="flex-1 text-sm bg-purple-50 text-purple-600 py-1.5 rounded-lg hover:bg-purple-100"
          >
            ✨ AI
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 text-sm bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>

      {showEdit && (
        <TaskForm
          task={task}
          onSuccess={() => {
            setShowEdit(false);
            onRefresh();
          }}
          onCancel={() => setShowEdit(false)}
        />
      )}

      {showAI && (
        <AISuggest
          taskTitle={task.title}
          taskDescription={task.description || ""}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
}
