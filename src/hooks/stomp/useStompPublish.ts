import type { StompPublishOptions, StompPublishReturn } from "@/hooks/stomp/types";
import { useStompContext } from "@/hooks/stomp/useStompContext";
import { useAuthStore } from "@/store/authStore";
import { useCallback, useState } from "react";

export const useStompPublish = (): StompPublishReturn => {
  const { client, isConnected, error: contextError } = useStompContext();
  const [publishError, setPublishError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const error = contextError || publishError;

  const publish = useCallback(
    async (destination: string, body: unknown, options: StompPublishOptions = {}): Promise<boolean> => {
      setPublishError(null);

      if (!client || !isConnected) {
        const errorMsg = "STOMP 클라이언트가 연결되지 않았습니다";
        console.error(errorMsg);
        setPublishError(errorMsg);
        return false;
      }

      try {
        const headers = { ...options.headers };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("STOMP Publish:", {
          destination,
          hasToken: !!token,
          headers,
          body: typeof body === "object" ? JSON.stringify(body) : body,
        });

        client.publish({
          destination,
          body: typeof body === "object" && body !== null ? JSON.stringify(body) : String(body),
          headers,
          skipContentLengthHeader: options.skipContentLengthHeader,
        });
        console.log(`메시지 발송 성공: ${destination}`);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "메시지 발송 중 오류가 발생했습니다";
        console.error(`메시지 발송 실패: ${destination}`, err);
        setPublishError(errorMessage);
        return false;
      }
    },
    [client, isConnected, token],
  );

  return { publish, isConnected, error };
};
