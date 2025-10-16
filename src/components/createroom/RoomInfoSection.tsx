import { InputWithLabel, ErrorMessage } from "@/components/common";
import { MAX_PARTICIPANT, MIN_PARTICIPANT } from "@/constants";
import { useFormContext } from "react-hook-form";
import type { CreateRoomFormSchemaType } from "@/model/CreateRoomFormSchema";

export const RoomInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateRoomFormSchemaType>();

  return (
    <section className="space-y-4">
      <div>
        <InputWithLabel
          label="방 이름"
          placeholder="방 이름을 입력해주세요."
          id="room-name"
          {...register("roomName")}
        />
        {errors.roomName && <ErrorMessage error={errors.roomName.message} />}
      </div>
      <div>
        <InputWithLabel
          label="참여 인원"
          placeholder="참여 인원을 입력해주세요"
          type="number"
          min={MIN_PARTICIPANT}
          max={MAX_PARTICIPANT}
          id="room-capacity"
          {...register("capacity", { valueAsNumber: true })}
        />
        {errors.capacity && <ErrorMessage error={errors.capacity.message} />}
      </div>
    </section>
  );
};
