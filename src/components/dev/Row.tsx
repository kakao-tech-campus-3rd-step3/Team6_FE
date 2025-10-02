import type { RowProps } from "@/components/dev/types";

export const Row = ({ label, value, status = "normal" }: RowProps) => {
  const statusColors = {
    normal: "text-gray-300",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  return (
    <div className="flex justify-between border-b border-gray-700 py-1">
      <span className="text-gray-400">{label}</span>
      <span className={`font-bold ${statusColors[status]}`}>{value}</span>
    </div>
  );
};
