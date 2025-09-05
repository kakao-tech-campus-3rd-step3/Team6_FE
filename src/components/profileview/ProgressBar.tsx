interface ProgressBarProps {
  currentIndex: number;
  totalCount: number;
  timeLeft: number;
  progressPercentage: number;
}

export const ProgressBar = ({ currentIndex, totalCount, timeLeft, progressPercentage }: ProgressBarProps) => {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {currentIndex + 1}/{totalCount}
        </span>
        <span className="text-sm text-gray-500">{timeLeft}초 남음</span>
      </div>

      {/* 진행바 */}
      <div className="bg-opacity-30 mb-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
