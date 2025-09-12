import type { GetUserResponseBody } from "@/api/users/types";
import { api } from "@/lib";

export const getUserById = async (id: number) => {
  const { data: response } = await api.get<BaseResponse<GetUserResponseBody>>(`/users/${id}`);
  return response.data;
};
