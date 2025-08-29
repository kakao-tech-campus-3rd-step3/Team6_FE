export interface ErrorConfig {
    code:string;
    statusCode?:number;
    message:string;
    metadata?:Record<string,unknown>;
}

export type ErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TOKEN_EXPIRED'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';