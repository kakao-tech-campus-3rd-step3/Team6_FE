import { STOMP_REQUIRED_PATHS } from "@/constants";
import { StompProvider } from "@/context/StompProvider";
import { useAuthStore } from "@/store/authStore";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ConditionalStompProviderProps {
  children: ReactNode;
}

export const ConditionalStompProvider = ({ children }: ConditionalStompProviderProps) => {
  const token = useAuthStore((state) => state.token);
  const brokerURL = import.meta.env.VITE_BROKER_URL || "ws://localhost:8080/ws";
  const location = useLocation();

  const currentPath = location.pathname;
  const urlParams = new URLSearchParams(location.search);
  const purpose = urlParams.get("purpose");
  const isCreateRoomFlow = currentPath === "/profile" && purpose === "create-room";

  const needsStompConnection = token && STOMP_REQUIRED_PATHS.some((path) => currentPath.startsWith(path));

  const finalNeedsConnection = needsStompConnection || (token && isCreateRoomFlow);

  if (finalNeedsConnection) {
    return (
      <StompProvider brokerURL={brokerURL} token={token}>
        {children}
      </StompProvider>
    );
  }

  return <>{children}</>;
};
