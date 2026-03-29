"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTasks } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import TaskStats from "@/components/TaskStats";
import TaskForm from "@/components/TaskForm";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  due_date?: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    await fetchTasks();
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">AI TaskFlow</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <TaskStats tasks={tasks} />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Your Tasks</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400">
            Loading tasks...
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No tasks yet. Create your first one!</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
            ))}
          </div>
        )}
      </main>

      {showCreateForm && (
        <TaskForm
          onSuccess={() => {
            setShowCreateForm(false);
            fetchTasks();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}
