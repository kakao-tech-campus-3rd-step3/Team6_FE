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
      const newPath = window.location.pathname;
      setCurrentPath((prevPath) => (prevPath !== newPath ? newPath : prevPath));
    };

    window.addEventListener("popstate", handleLocationChange);

    const intervalId = setInterval(() => {
      handleLocationChange();
    }, INTERVAL_DELAY);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      clearInterval(intervalId);
    };
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
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
