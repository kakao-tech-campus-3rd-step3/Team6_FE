import type { GetUserResponseBody } from "@/api/users/types";
import { api } from "@/lib";

export const getAllUsers = async () => {
  const { data: response } = await api.get<BaseResponse<GetUserResponseBody[]>>("/users");
  return response.data;
};
