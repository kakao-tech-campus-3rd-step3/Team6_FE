import type { StompErrorCode, StompErrorConfigEntry } from "@/errors/types";
import { AUTH_ERRORS } from "./auth-errors";
import { COMMON_ERRORS } from "./common-errors";
import { ROOM_ERRORS } from "./room-errors";
import { STOMP_CONNECTION_ERRORS } from "./stomp-connection-errors";

export const STOMP_ERROR_CONFIGS: Record<StompErrorCode, StompErrorConfigEntry> = {
  ...STOMP_CONNECTION_ERRORS,
  ...ROOM_ERRORS,
  ...AUTH_ERRORS,
  ...COMMON_ERRORS,
} as const;
