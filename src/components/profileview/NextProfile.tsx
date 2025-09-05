interface NextProfileProps {
  currentIndex: number;
  totalCount: number;
  nextProfileName: string;
}

export const NextProfile = ({ currentIndex, totalCount, nextProfileName }: NextProfileProps) => {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-500">
        {currentIndex >= totalCount - 1 ? "마지막 프로필입니다." : `다음 : ${nextProfileName}`}
      </span>
    </div>
  );
};
