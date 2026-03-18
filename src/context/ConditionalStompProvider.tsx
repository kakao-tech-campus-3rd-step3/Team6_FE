import { STOMP_REQUIRED_PATHS } from "@/constants";
import { StompProvider } from "@/context/StompContext";
import { useAuthStore } from "@/store/authStore";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ConditionalStompProviderProps {
  children: ReactNode;
}

const useMockSignal = import.meta.env.VITE_MOCK_SIGNAL === "true";

export const ConditionalStompProvider = ({ children }: ConditionalStompProviderProps) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  const currentPath = location.pathname;
  const urlParams = new URLSearchParams(location.search);
  const purpose = urlParams.get("purpose");
  const isCreateRoomFlow = currentPath === "/profile" && purpose === "create-room";

  const needsStompConnection = token && STOMP_REQUIRED_PATHS.some((path) => currentPath.startsWith(path));

  const finalNeedsConnection = useMockSignal || needsStompConnection || (token && isCreateRoomFlow);

  if (finalNeedsConnection) {
    return <StompProvider>{children}</StompProvider>;
  }

  return <>{children}</>;
};
