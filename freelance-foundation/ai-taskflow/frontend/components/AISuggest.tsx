"use client";

import { useState } from "react";
import { getAISuggestion } from "@/lib/api";

type Props = {
  taskTitle: string;
  taskDescription: string;
  onClose: () => void;
};

export default function AISuggest({
  taskTitle,
  taskDescription,
  onClose,
}: Props) {
  const [action, setAction] = useState<"priority" | "rewrite" | "subtasks">(
    "priority",
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuggest = async () => {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const data = await getAISuggestion(taskTitle, taskDescription, action);
      setResult(data.suggestion || "No suggestion returned.");
    } catch {
      setError("AI service unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">✨ AI Suggest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-gray-600">Task: {taskTitle}</p>
        </div>

        <div className="flex gap-2 mb-4">
          {(["priority", "rewrite", "subtasks"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${
                  action === a
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          onClick={handleSuggest}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 mb-4"
        >
          {loading ? "✨ Thinking..." : "✨ Get Suggestion"}
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-700 mb-1">
              Suggestion:
            </p>

            <p className="text-gray-800 whitespace-pre-wrap text-sm">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
