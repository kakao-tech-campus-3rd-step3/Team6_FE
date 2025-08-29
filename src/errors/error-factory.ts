import { ERROR_CONFIGS } from "@/constants/error-configs";
import { ApiError } from "@/errors/api-errors";
import type { ErrorCode } from "@/errors/types";
import type { AxiosError } from "axios";

const statusCodeMap: Record<number, ErrorCode> = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED", 
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        422: "VALIDATION_ERROR",
        500: "SERVER_ERROR",
        502: "BAD_GATEWAY",
        503: "SERVICE_UNAVAILABLE",
        504: "GATEWAY_TIMEOUT",
      };

export class ErrorFactory{
    static create(
        code:ErrorCode,
        message?:string,
        metadata?:Record<string,unknown>,
        statusCode?:number,
    ):ApiError{
        const config = ERROR_CONFIGS[code] ?? ERROR_CONFIGS.UNKNOWN_ERROR;
        return new ApiError({
            code,
            statusCode: statusCode ?? config.statusCode,
            message:message || config.defaultMessage,
            metadata,
    })}

    static fromStatusCode(
      statusCode:number,
      message?:string,
      metadata?:Record<string,unknown>,
    ):ApiError{
      const code = statusCodeMap[statusCode] ?? "UNKNOWN_ERROR";
      return this.create(code, message, metadata, statusCode);
    }

    static fromAxiosError(
      error: AxiosError<BaseErrorResponse>
    ):ApiError{
      if(!error.response){
        return this.create("NETWORK_ERROR",error.message);
      }
      const {status,data} = error.response;
      const message = data?.message || error.message;
      
      const metadata = data?.metadata;

      if(status===401 && data?.code ==="TOKEN_EXPIRED"){
        return this.create("TOKEN_EXPIRED",message,metadata);
      }
      return this.fromStatusCode(status,message,metadata);
    }
}