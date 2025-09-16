import { STOMP_REQUIRED_PATHS } from "@/constants";
import { StompProvider } from "@/context/StompProvider";
import { useAuthStore } from "@/store/authStore";
import { type ReactNode, useEffect, useState } from "react";

interface ConditionalStompProviderProps {
  children: ReactNode;
}

const INTERVAL_DELAY = 1000;

export const ConditionalStompProvider = ({ children }: ConditionalStompProviderProps) => {
  const token = useAuthStore((state) => state.token);
  const brokerURL = import.meta.env.VITE_STOMP_URL || "ws://localhost:8080/ws";
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    const intervalId = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    }, INTERVAL_DELAY);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      clearInterval(intervalId);
    };
  }, [currentPath]);

  const needsStompConnection = token && STOMP_REQUIRED_PATHS.some((path) => currentPath.startsWith(path));

  // purpose=create-room 파라미터가 있으면서 profile 페이지인 경우도 포함
  const urlParams = new URLSearchParams(window.location.search);
  const purpose = urlParams.get("purpose");
  const isCreateRoomFlow = currentPath === "/profile" && purpose === "create-room";

  const finalNeedsConnection = needsStompConnection || (token && isCreateRoomFlow);

  console.log("STOMP 연결 체크:", {
    hasToken: !!token,
    currentPath,
    purpose,
    isCreateRoomFlow,
    needsStompConnection,
    finalNeedsConnection,
    brokerURL,
  });

  if (finalNeedsConnection) {
    return (
      <StompProvider brokerURL={brokerURL} token={token}>
        {children}
      </StompProvider>
    );
  }

  return <>{children}</>;
};
