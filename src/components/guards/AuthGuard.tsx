import { useAuthStore } from "@/store/authStore";
import { useActivity, useFlow } from "@stackflow/react/future";
import { useEffect, useRef, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = "ProfilePage" }: AuthGuardProps) => {
  const { push } = useFlow();
  const { params } = useActivity();
  const token = useAuthStore((state) => state.token);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    if (!token && params?.roomId && !isRedirecting) {
      setIsRedirecting(true);

      requestAnimationFrame(() => {
        push(redirectTo, { roomId: params.roomId });
      });
    }
  }, [token, params?.roomId, push, redirectTo, isRedirecting]);

  if (!token || isRedirecting) {
    return null;
  }

  return <>{children}</>;
};
