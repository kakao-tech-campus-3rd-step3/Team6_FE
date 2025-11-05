import { ErrorMessage, InputWithLabel } from "@/components/common";
import type { FormSchemaType } from "@/model/FormSchema";
import { range } from "@/utils";
import { useFormContext } from "react-hook-form";

const AVAILABLE_START_AGE = 15;
const AVAILABLE_END_AGE = 55;
const MAX_PHONE_LENGTH = 13;

export const ProfileInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormSchemaType>();
  const ageOptions = range(AVAILABLE_START_AGE, AVAILABLE_END_AGE);

  return (
    <section className="space-y-4">
      <div>
        <InputWithLabel label="이름" id="profile-name" placeholder="이름을 입력해주세요." {...register("name")} />
        {errors.name && <ErrorMessage error={errors.name.message} />}
      </div>
      <div>
        <InputWithLabel
          label="전화번호"
          type="tel"
          maxLength={MAX_PHONE_LENGTH}
          id="profile-phone"
          placeholder="전화번호를 입력해주세요.(- 제외)"
          {...register("phone")}
        />
        {errors.phone && <ErrorMessage error={errors.phone.message} />}
      </div>
      <div>
        <label htmlFor="profile-age" className="mb-2 block text-lg font-semibold">
          나이
        </label>
        <select
          id="profile-age"
          className="h-12 w-full rounded-xl border-none bg-white px-4 pr-10 text-lg shadow-md outline-none"
          {...register("age", { valueAsNumber: true })}
        >
          <option value="" disabled>
            나이를 선택해주세요
          </option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
        {errors.age && <ErrorMessage error={errors.age.message} />}
      </div>
    </section>
  );
};
