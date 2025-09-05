declare interface BaseResponse<T>{
    message:string;
    data:T;
    success:boolean;
}

declare interface BaseErrorResponse{
    code?:string;
    message?:string;
    metadata?:Record<string,unknown>;
}