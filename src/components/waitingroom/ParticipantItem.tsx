import type { ParticipantItemProps } from "@/components/waitingroom/types";
import { User } from "lucide-react";

export const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  const isJoined = participant.isJoined;

  return (
    <li
      className={`flex h-14 w-full flex-row items-center rounded-md p-2 ${isJoined ? "bg-secondary" : "bg-gray-200"}`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${isJoined ? "bg-primary" : "bg-gray-300"}`}
        aria-hidden="true"
      >
        <User color={isJoined ? "white" : "black"} size={16} />
      </div>
      <span className={`ml-2 font-medium ${isJoined ? "text-black" : "text-gray-400"}`}>
        {isJoined ? participant.name : "대기 중..."}
        <span className="sr-only">{isJoined ? " - 참여 중" : " - 대기 중"}</span>
      </span>
      {isJoined && <div className="ml-2 h-3 w-3 animate-pulse rounded-full bg-green-500" aria-hidden="true" />}
    </li>
  );
};
