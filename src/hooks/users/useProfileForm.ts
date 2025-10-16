import { useCreateUser } from "@/hooks/users";
import { FormSchema, type FormSchemaType } from "@/model/FormSchema";
import { useAuthStore } from "@/store/authStore";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActivity, useFlow } from "@stackflow/react/future";
import { useForm } from "react-hook-form";

export const useProfileForm = () => {
  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      age: undefined,
      mbti: undefined,
      interests: [],
      introduction: "",
    },
  });

  const { mutate: createUser, isPending, error } = useCreateUser();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { push } = useFlow();
  const { params } = useActivity();

  const onSubmit = methods.handleSubmit((data) => {
    createUser(
      {
        name: data.name,
        phone: data.phone,
        age: data.age,
        mbtiValue: data.mbti,
        interests: data.interests,
        introduction: data.introduction || "",
      },
      {
        onSuccess: (response) => {
          setAuth(response.token, response.userId);
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
        onError: (err) => {
          showToast.error(err.message);
        },
      },
    );
  });

  return {
    methods,
    handleSubmit: onSubmit,
    isFormValid: methods.formState.isValid,
    isPending,
    error,
  };
};
