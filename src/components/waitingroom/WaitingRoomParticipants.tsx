import { ParticipantItem, ProgressBar, type WaitingRoomParticipantsProps } from "@/components/waitingroom";

export const WaitingRoomParticipants = ({ participants, maxParticipants }: WaitingRoomParticipantsProps) => {
  const joinedCount = participants.length;
  // TODO : 백엔드와 논의 후 참가자 목록 UI 수정 예정
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
      <ProgressBar current={joinedCount} capacity={maxParticipants} />
      <ul className="flex w-full flex-col gap-2" role="list">
        {participants.map((participant) => (
          <ParticipantItem key={participant.id} participant={participant} />
        ))}
      </ul>
    </section>
  );
};
