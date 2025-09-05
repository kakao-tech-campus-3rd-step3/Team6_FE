import { InputWithLabel } from "@/components/common";

export const RoomInfoSection = () => {
  return (
    <section className="space-y-4">
      <InputWithLabel label="방 이름" placeholder="방 이름을 입력해주세요." id="room-name" />
      <InputWithLabel label="참여 인원" placeholder="참여 인원을 입력해주세요" type="number" min={2} max={99} id="room-capacity" />
    </section>
  );
};