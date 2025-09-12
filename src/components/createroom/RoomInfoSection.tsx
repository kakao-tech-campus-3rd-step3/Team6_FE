import { InputWithLabel } from "@/components/common";
import { MAX_PARTICIPANT, MIN_PARTICIPANT } from "@/constants";

interface RoomInfoSectionProps {
  roomName: string;
  capacity: number;
  onRoomNameChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
}

export const RoomInfoSection = ({ roomName, capacity, onRoomNameChange, onCapacityChange }: RoomInfoSectionProps) => {
  return (
    <section className="space-y-4">
      <InputWithLabel
        label="방 이름"
        placeholder="방 이름을 입력해주세요."
        id="room-name"
        value={roomName}
        onChange={(e) => onRoomNameChange(e.target.value)}
      />
      <InputWithLabel
        label="참여 인원"
        placeholder="참여 인원을 입력해주세요"
        type="number"
        min={MIN_PARTICIPANT}
        max={MAX_PARTICIPANT}
        id="room-capacity"
        value={capacity.toString()}
        onChange={(e) => onCapacityChange(Number(e.target.value))}
      />
    </section>
  );
};
