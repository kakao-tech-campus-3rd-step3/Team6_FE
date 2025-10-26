import { useCreateUser } from "@/hooks/users";
import { FormSchema, type FormSchemaType } from "@/model/FormSchema";
import { useAuthStore } from "@/store/authStore";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit = methods.handleSubmit((data) => {
    createUser(
      {
        name: data.name,
        phone: data.phone,
        age: data.age,
        mbtiValue: data.mbti,
        interests: data.interests,
        introduction: data.introduction,
      },
      {
        onSuccess: (response) => {
          setAuth(response.token, response.userId);
          const roomId = searchParams.get("roomId");
          const purpose = searchParams.get("purpose");

          if (roomId) {
            navigate(`/waiting-room/${roomId}?isHost=false`);
          } else if (purpose === "create-room") {
            navigate("/create-room");
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
