import type { ParticipantItemProps } from "@/components/waitingroom";
import { User } from "lucide-react";

export const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  const isHost = participant.role === 'HOST';

  return (
    <li
      className="flex h-14 w-full flex-row items-center rounded-md p-2 bg-secondary"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
        aria-hidden="true"
      >
        <User color="white" size={16} />
      </div>
      <span className="ml-2 font-medium text-black">
        {participant.name}
        {isHost && " (호스트)"}
        <span className="sr-only"> - 참여 중</span>
      </span>
      <div className="ml-2 h-3 w-3 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
    </li>
  );
};
