import { useAuthStore } from "@/store/authStore";
import { type LoaderFunctionArgs, redirect } from "react-router-dom";

export const authLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const token = useAuthStore.getState().token;
  const url = new URL(request.url);
  const roomId = params.roomId || url.searchParams.get("roomId");

  if (!token && roomId) {
    return redirect(`/profile?roomId=${roomId}`);
  }

  if (!token) {
    return redirect("/");
  }

  return null;
};
