import { MIN_PARTICIPANT } from "@/constants";
import { CreateRoomFormSchema, type CreateRoomFormSchemaType } from "@/model/CreateRoomFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useCreateRoomForm = () => {
  const methods = useForm<CreateRoomFormSchemaType>({
    resolver: zodResolver(CreateRoomFormSchema),
    mode: "onChange",
    defaultValues: {
      roomName: "",
      capacity: MIN_PARTICIPANT,
      purpose: undefined,
    },
  });

  return {
    methods,
    isFormValid: methods.formState.isValid,
  };
};
