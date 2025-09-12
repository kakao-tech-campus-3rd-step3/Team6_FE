import type { CreateUserRequestBody, CreateUserResponseBody } from "@/api/users/types";
import { api } from "@/lib";

export const createUser = async (body: CreateUserRequestBody): Promise<CreateUserResponseBody> => {
  const { data: response } = await api.post<BaseResponse<CreateUserResponseBody>>(`/users`, body);
  return response.data;
};
