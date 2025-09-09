import type { InterestType } from "@/constants";
import { useCreateUser } from "@/hooks/users";
import type { MBTI } from "@/types/mbti";
import { useFlow } from "@stackflow/react/future";
import { useCallback, useState } from "react";

interface ProfileFormData {
  name: string;
  phone: string;
  age: number;
  mbti: MBTI | "";
  interests: InterestType[];
  introduction: string;
}

const initialFormData: ProfileFormData = {
  name: "",
  phone: "",
  age: 0,
  mbti: "",
  interests: [],
  introduction: "",
};

export const useProfileForm = () => {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const { mutate: createUser, isPending, error } = useCreateUser();
  const { push } = useFlow();

  const updateField = useCallback(<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.age > 0 &&
      formData.mbti !== "" &&
      formData.interests.length > 0 &&
      formData.introduction.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (!isFormValid() || !formData.mbti) return;

    createUser(
      {
        name: formData.name,
        phone: formData.phone,
        age: formData.age,
        mbtiValue: formData.mbti,
        interests: formData.interests,
        introduction: formData.introduction,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess: (_data) => {
          //TODO: 성공시 userId와 토큰을 반환하는데 토큰을 어떻게 할지 -> 웹(데스크탑,모바일)의 경우 스토리지, 만약 앱까지 하면?

          push("WaitingRoomPage", { title: "대기실" });
        },
        onError: (error) => {
          console.error("프로필 생성 실패:", error);
          // TODO: 에러 토스트를 할지 아니면 다른 방식을 쓸지
        },
      },
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
    isFormValid: isFormValid(),
    isPending,
    error,
  };
};
