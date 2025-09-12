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
        const headers: Record<string, string> = { ...(options.headers ?? {}) };
        const hasAuthHeader = Object.keys(headers).some((k) => k.toLocaleLowerCase() === "authorization");
        if (token && !hasAuthHeader) {
          headers.Authorization = `Bearer ${token}`;
        }
        const isObjectBody = typeof body === "object" && body !== null;
        const hasContentType = Object.keys(headers).some((k) => k.toLocaleLowerCase() === "content-type");
        if (isObjectBody && !hasContentType) {
          headers["content-type"] = "application/json";
        }

        if (process.env.NODE_ENV === "development") {
          const sensitiveKeys = ["authorization", "cookie", "set-cookie", "token", "x-auth-token"];
          const MAX_LOG_LENGTH = 100;

          const sanitizedHeaders = Object.entries(headers).reduce(
            (acc, [key, value]) => {
              const isSensitive = sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive));
              acc[key] = isSensitive ? "[REDACTED]" : value;
              return acc;
            },
            {} as Record<string, string>,
          );

          const safeBody =
            typeof body === "object" && body !== null
              ? `[Object: ${Object.keys(body).length} keys]`
              : typeof body === "string" && body.length > MAX_LOG_LENGTH
                ? `${body.substring(0, MAX_LOG_LENGTH)}...(truncated, length: ${body.length})`
                : body;

          console.log("STOMP Publish:", {
            destination,
            hasToken: !!token,
            headers: sanitizedHeaders,
            body: safeBody,
          });
        }

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
