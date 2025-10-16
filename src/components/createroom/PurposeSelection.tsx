import { type PurposeId, ROOM_PURPOSE } from "@/constants";
import { useFormContext } from "react-hook-form";
import type { CreateRoomFormSchemaType } from "@/model/CreateRoomFormSchema";
import { ErrorMessage } from "@/components/common";

import { OptionCard } from "./OptionCard";

export const PurposeSelection = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateRoomFormSchemaType>();
  const selectedPurpose = watch("purpose");

  const handlePurposeChange = (purpose: PurposeId) => {
    setValue("purpose", purpose, { shouldValidate: true });
  };

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold text-black">목적</legend>
        <div className="space-y-3" role="radiogroup" aria-label="방 목적 선택">
          {ROOM_PURPOSE.map((purpose) => (
            <OptionCard
              key={purpose.id}
              title={purpose.title}
              description={purpose.description}
              isSelected={selectedPurpose === purpose.id}
              onClick={() => handlePurposeChange(purpose.id)}
            />
          ))}
        </div>
        {errors.purpose && <ErrorMessage error={errors.purpose.message} />}
      </fieldset>
    </section>
  );
};
