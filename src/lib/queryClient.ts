import { MILLISECOND_IN_SECOND, SECONDS_IN_MINUTE } from "@/constants";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MILLISECOND_IN_SECOND * SECONDS_IN_MINUTE, // 1분
      retry: 3,
    },
  },
});
