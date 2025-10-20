import { ErrorMessage } from "@/components/common";
import type { FormSchemaType } from "@/model/FormSchema";
import { useFormContext } from "react-hook-form";

const MAX_LENGTH = 100;
const MAX_ROW = 3;

export const ProfileIntroduce = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormSchemaType>();
  const introduction = watch("introduction") || "";

  return (
    <section className="space-y-4">
      <h3 id="profile-introduce-label" className="text-lg font-semibold">
        한줄 소개
      </h3>
      <div>
        <textarea
          id="profile-introduce"
          placeholder="자신을 간단히 소개해주세요"
          className="w-full rounded-xl bg-white p-2 shadow-sm"
          maxLength={MAX_LENGTH}
          aria-describedby="character-count"
          aria-labelledby="profile-introduce-label"
          rows={MAX_ROW}
          {...register("introduction")}
        />
        {errors.introduction && <ErrorMessage error={errors.introduction.message} />}
        <div id="character-count" className="mt-1 text-right text-sm text-gray-500" aria-live="polite">
          {introduction.length}/{MAX_LENGTH}
        </div>
      </div>
    </section>
  );
};
