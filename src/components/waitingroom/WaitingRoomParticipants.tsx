import { ParticipantItem, ProgressBar } from "@/components/waitingroom";
import type { WaitingRoomParticipantsProps } from "@/components/waitingroom/types";

export const WaitingRoomParticipants = ({
  participants = [
    { id: "1", name: "참가자 1", isJoined: true },
    { id: "2", name: "참가자 2", isJoined: true },
    { id: "3", name: "참가자 3", isJoined: false },
    { id: "4", name: "참가자 4", isJoined: false },
  ],
  maxParticipants = 4,
}: WaitingRoomParticipantsProps) => {
  const joinedCount = participants.filter((p) => p.isJoined).length;

  return (
    <section
      className="flex w-full flex-col items-center gap-2 rounded-xl bg-white p-2"
      aria-labelledby="participants-title"
    >
      <h2 id="participants-title" className="text-xl font-semibold">
        현재 참가자
      </h2>
      <div className="text-primary text-3xl font-bold" aria-live="polite">
        {joinedCount} / {maxParticipants}
      </div>
      <ProgressBar current={joinedCount} max={maxParticipants} />
      <ul className="flex w-full flex-col gap-2" role="list">
        {participants.map((participant) => (
          <ParticipantItem key={participant.id} participant={participant} />
        ))}
      </ul>
    </section>
  );
};
