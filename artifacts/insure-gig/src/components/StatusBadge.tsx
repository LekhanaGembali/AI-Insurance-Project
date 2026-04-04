interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  approved: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  active: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  processing: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  inactive: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  moderate: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  high: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  extreme: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status.toLowerCase()] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
