import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error("User not authenticated");
  }
  return {
    Authorization: `Bearer ${data.session.access_token}`,
    "Content-Type": "application/json",
  };
};

export const getTasks = async () => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/tasks`, { headers });
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
};

export const createTask = async (taskData: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  due_date?: string;
}) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
};

export const updateTask = async (
  id: string,
  taskData: Partial<{
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date: string;
  }>,
) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
};

export const deleteTask = async (id: string) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
  return res.json();
};

export const getAISuggestion = async (
  task_title: string,
  task_description: string,
  action: "priority" | "rewrite" | "subtasks",
) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/ai/suggest`, {
    method: "POST",
    headers,
    body: JSON.stringify({ task_title, task_description, action }),
  });
  if (!res.ok) {
    throw new Error("AI request failed");
  }
  return res.json();
};
