import { InputWithLabel } from "@/components/common";

export const ProfileInfo = () => {
  return (
    <section className="space-y-4">
      <InputWithLabel label="이름" id="profile-name" />
      <InputWithLabel label="전화번호" type="tel" maxLength={13} id="profile-phone" />
      <InputWithLabel label="나이" type="number" id="profile-age" />
    </section>
  );
};
