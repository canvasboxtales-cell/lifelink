interface Props { status: string; }

const statusConfig: Record<string, { color: string; dot: string }> = {
  active: { color: 'text-green-700 bg-green-50', dot: 'bg-green-500' },
  available: { color: 'text-green-700 bg-green-50', dot: 'bg-green-500' },
  pending: { color: 'text-orange-700 bg-orange-50', dot: 'bg-orange-400' },
  completed: { color: 'text-blue-700 bg-blue-50', dot: 'bg-blue-500' },
  unavailable: { color: 'text-gray-600 bg-gray-50', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status }: Props) {
  const cfg = statusConfig[status] || statusConfig.unavailable;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
