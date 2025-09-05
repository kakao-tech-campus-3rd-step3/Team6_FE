export const WaitingRoomCode = () => {
  return (
    <div
      className="flex h-10 w-auto flex-row items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2"
      role="status"
      aria-label="방 상태 및 코드 정보"
    >
      <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
      <span className="font-medium">방 코드:</span>
      <span className="ml-2 font-semibold" aria-label="방 코드 ABC123">
        ABC123
      </span>
    </div>
  );
};
