interface NextProfileProps {
  currentIndex: number;
  totalCount: number;
  nextProfileName: string;
}

export const NextProfile = ({ currentIndex, totalCount, nextProfileName }: NextProfileProps) => {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-500">
        {currentIndex >= totalCount - 1 ? "마지막" : `다음 : ${nextProfileName}`}
      </span>
    </div>
  );
};
