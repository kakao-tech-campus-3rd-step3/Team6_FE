import type { InterestType } from "@/constants";
import { useCreateUser } from "@/hooks/users";
import { useAuthStore } from "@/store/authStore";
import type { MBTI } from "@/types/mbti";
import { useActivity, useFlow } from "@stackflow/react/future";
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
  const setAuth = useAuthStore((state) => state.setAuth);
  const { push } = useFlow();
  const { params } = useActivity();

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
        onSuccess: (data) => {
          console.log("프로필 생성 성공, 토큰 저장됨:", data);

          setAuth(data.token, data.userId);
          // URL에서 roomId 확인 (QR코드/링크로 들어온 참여자인지 체크)
          const urlParams = new URLSearchParams(window.location.search);
          const queryRoomId = urlParams.get("roomId");
          const pathRoomId = params?.roomId as string;
          const roomId = queryRoomId || pathRoomId;
          const purpose = params?.purpose as string;

          if (roomId) {
            push("WaitingRoomPage", { roomId, isHost: "false" });
          } else if (purpose === "create-room") {
            push("CreateRoomPage", { title: "방 만들기" });
          } else {
            // TODO : 추후 메뉴 선택 페이지로 이동 못하고 방 만들기 or 방 참여로만 되도록 변경 예정
            push("MenuSelectPage", {});
          }
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
