export function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-300",
    processing: "bg-blue-500/20 text-blue-300",
    completed: "bg-green-500/20 text-green-300",
    failed: "bg-red-500/20 text-red-300"
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[status] ?? "bg-gray-500/20 text-gray-300"}`}>
      {status}
    </span>
  );
}
