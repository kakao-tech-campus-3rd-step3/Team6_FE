import { createUser } from "@/api/users/createUser";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};
