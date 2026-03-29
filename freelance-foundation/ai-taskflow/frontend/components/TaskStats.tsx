"use client";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string;
  description?: string;
};

export default function TaskStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  const StatCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total" value={total} color="border-blue-500" />
      <StatCard label="Pending" value={pending} color="border-yellow-500" />
      <StatCard
        label="In Progress"
        value={inProgress}
        color="border-purple-500"
      />
      <StatCard label="Completed" value={completed} color="border-green-500" />
    </div>
  );
}
