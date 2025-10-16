import { Button, ErrorMessage } from "@/components/common";
import { INTERESTS, type InterestType } from "@/constants";
import { useMultiSelection } from "@/hooks";
import type { FormSchemaType } from "@/model/FormSchema";
import { useFormContext } from "react-hook-form";

export const ProfileInterests = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormSchemaType>();
  const interests = watch("interests");

  const handleChange = (newInterests: InterestType[]) => {
    setValue("interests", newInterests, { shouldValidate: true });
  };

  const { toggleSelection, isSelected } = useMultiSelection<InterestType>(interests, handleChange);

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold">관심사</legend>
        <div className="grid grid-cols-4 gap-2">
          {INTERESTS.map((interest) => (
            <Button
              key={interest}
              variant={isSelected(interest) ? "main" : "text"}
              onClick={() => toggleSelection(interest)}
              className="h-10 text-base"
              aria-pressed={isSelected(interest)}
            >
              {interest}
            </Button>
          ))}
        </div>
        {errors.interests && <ErrorMessage error={errors.interests.message} />}
      </fieldset>
    </section>
  );
};
