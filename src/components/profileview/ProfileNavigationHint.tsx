export const ProfileNavigationHint = () => {
  return (
    <>
      <p className="flex w-full max-w-md items-center justify-center gap-2 text-sm md:hidden" role="note">
        <span>스와이프를 통해 다른 참가자들을 확인해주세요</span>
      </p>
      <p className="hidden w-full max-w-md items-center justify-center gap-2 text-sm md:flex" role="note">
        <span>화살표 키 또는 버튼으로 탐색하세요</span>
      </p>
    </>
  );
};
