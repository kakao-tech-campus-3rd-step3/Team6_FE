import type { ProgressBarProps } from "@/components/waitingroom";

const PERCENTAGE_MULTIPLIER = 100;

export const ProgressBar = ({ current, capacity }: ProgressBarProps) => {
  const safeCapacity = Math.max(1, capacity || 1);
  const safeCurrent = Math.max(0, Math.min(current || 0, safeCapacity));
  const percentage = safeCapacity > 0 ? (safeCurrent / safeCapacity) * PERCENTAGE_MULTIPLIER : 0;

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <progress
        value={safeCurrent}
        max={safeCapacity}
        aria-label={`참가자 ${Math.round(safeCurrent)}명 중 ${Math.round(safeCapacity)}명`}
        className="sr-only"
      />
      <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
    </div>
  );
};
