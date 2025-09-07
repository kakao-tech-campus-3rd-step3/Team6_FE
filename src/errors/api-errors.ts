import type { ErrorCode, ErrorConfig } from "@/errors/types";

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number | undefined;
  public readonly metadata?: Record<string, unknown>;

  constructor(config: ErrorConfig) {
    super(config.message);
    this.name = "ApiError";
    this.code = config.code;
    this.statusCode = config.statusCode;
    this.metadata = config.metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
