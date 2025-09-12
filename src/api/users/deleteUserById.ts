import { api } from "@/lib";

export const deleteUserById = async (id: number) => {
  const { data: response } = await api.delete<BaseResponse<void>>(`/users/${id}`);
  return response.data;
};
