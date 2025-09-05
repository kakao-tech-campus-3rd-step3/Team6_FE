import type { ProgressBarProps } from "@/components/waitingroom/types";

export const ProgressBar = ({ current, max }: ProgressBarProps) => {
  const safeMax = Math.max(1, max || 1);
  const safeCurrent = Math.max(1, Math.min(current || 1, safeMax));
  const percentage = (safeCurrent / safeMax) * 100;

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <progress
        value={safeCurrent}
        max={safeMax}
        aria-label={`참가자 ${Math.round(safeCurrent)}명 중 ${Math.round(safeMax)}명`}
        className="sr-only"
      />
      <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
    </div>
  );
};
