import { Button, ErrorMessage } from "@/components/common";
import { mbtiPairs } from "@/constants";
import { useMbti } from "@/hooks/users";
import type { FormSchemaType } from "@/model/FormSchema";
import type { MBTI } from "@/types/mbti";
import { useFormContext } from "react-hook-form";

export const ProfileMbti = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormSchemaType>();
  const mbti = watch("mbti");

  const handleChange = (newMbti: MBTI | "") => {
    setValue("mbti", newMbti as MBTI, { shouldValidate: true });
  };

  const { handleSelection, isSelected } = useMbti(mbti || "", handleChange);

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold">MBTI</legend>
        <div className="grid grid-cols-4 gap-2">
          {mbtiPairs.map((pair) => (
            <div key={pair.dimension} role="radiogroup" aria-label={`${pair.dimension} 선택`} className="contents">
              {pair.options.map((option, rowIndex) => (
                <Button
                  key={`${pair.dimension}-${option}`}
                  variant={isSelected(option, pair.dimension) ? "main" : "sub"}
                  onClick={() => handleSelection(option, pair.dimension)}
                  className={`${rowIndex === 1 ? "row-start-2" : ""} h-10`}
                  role="radio"
                  aria-checked={isSelected(option, pair.dimension)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ))}
        </div>
        {errors.mbti && <ErrorMessage error={errors.mbti.message} />}
      </fieldset>
    </section>
  );
};
