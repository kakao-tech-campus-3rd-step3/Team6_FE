import type { ProgressBarProps } from "@/components/waitingroom/types";

export const ProgressBar = ({ current, max }: ProgressBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div
      className="h-2 w-full rounded-full bg-gray-200"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`참가자 ${current}명 중 ${max}명`}
    >
      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
    </div>
  );
};
