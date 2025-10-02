import type { StompErrorCode, StompErrorConfig } from "@/errors/types";

export class StompError extends Error {
  public readonly code: StompErrorCode;
  public readonly metadata?: Record<string, unknown>;

  constructor(config: StompErrorConfig) {
    super(config.message);
    this.name = "StompError";
    this.code = config.code;
    this.metadata = config.metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
