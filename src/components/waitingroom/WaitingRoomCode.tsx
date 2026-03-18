import type { WaitingRoomCodeProps } from "@/components/waitingroom";
import { useState } from "react";

const SPLIT_START = 0;
const SPLIT_END = 8;

export const WaitingRoomCode = ({ roomId }: WaitingRoomCodeProps) => {
  const [showFull, setShowFull] = useState(false);
  const shortRoomId = roomId?.substring(SPLIT_START, SPLIT_END);
  const displayCode = showFull ? roomId : shortRoomId;

  return (
    <div
      className="flex h-10 w-auto cursor-pointer flex-row items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-2 transition-colors hover:bg-gray-50"
      role="button"
      aria-label="방 상태 및 코드 정보"
      onClick={() => setShowFull(!showFull)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setShowFull(!showFull);
      }}
      tabIndex={0}
    >
      <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
      <span className="text-xs font-medium">방 코드:</span>
      <span className="ml-2 text-xs font-semibold" aria-label={`방 코드 ${roomId || "Loading..."}`}>
        {displayCode || "Loading..."}
      </span>
    </div>
  );
};
