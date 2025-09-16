import { InputWithLabel } from "@/components/common";
import { range } from "@/utils";

const AVAILABLE_START_AGE = 15;
const AVAILABLE_END_AGE = 55;
const MAX_PHONE_LENGTH = 13;

interface ProfileInfoData {
  name: string;
  phone: string;
  age: number;
}

interface ProfileInfoProps {
  data: ProfileInfoData;
  onChange: (field: keyof ProfileInfoData, value: ProfileInfoData[keyof ProfileInfoData]) => void;
}

export const ProfileInfo = ({ data: { name, phone, age }, onChange }: ProfileInfoProps) => {
  const ageOptions = range(AVAILABLE_START_AGE, AVAILABLE_END_AGE);

  return (
    <section className="space-y-4">
      <InputWithLabel
        label="이름"
        id="profile-name"
        placeholder="이름을 입력해주세요."
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <InputWithLabel
        label="전화번호"
        type="tel"
        maxLength={MAX_PHONE_LENGTH}
        id="profile-phone"
        placeholder="전화번호를 입력해주세요."
        value={phone}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      <div>
        <label htmlFor="profile-age" className="mb-2 block text-lg font-semibold">
          나이
        </label>
        <select
          id="profile-age"
          className="h-12 w-full rounded-xl border-none bg-white px-4 pr-10 text-lg shadow-md outline-none"
          value={age || ""}
          onChange={(e) => onChange("age", Number(e.target.value))}
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
      </div>
    </section>
  );
};
