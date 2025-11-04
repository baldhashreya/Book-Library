export enum HttpStatusCode {
  BadRequest = 400,
  ConflictError = 409,
  Forbidden = 403,
  InternalServerError = 500,
  NotFound = 404,
  Ok = 200,
  ServiceUnavailable = 503,
  Unauthorized = 401,
  Found = 302,
  MethodNotAllowed = 405,
  BadGateway = 502,
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SuccessResponse {
  message: string;
  data: any;
}

export interface ErrorStatusAndKey {
  statusCode: HttpStatusCode;
  errorKey: string;
  errorCode?: string;
}

export enum ErrorType {
  NotFound = "NotFound",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  InternalServerError = "InternalServerError",
  SequelizeDatabaseError = "SequelizeDatabaseError",
  Conflict = "Conflict"
}

export enum AuthOperation {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SIGNUP = "SIGNUP",
  INVALID_CRED = "INVALID_CRED",
  PASSWORD_UPDATE = "PASSWORD_UPDATE",
  USER_DETAILS = "USER_DETAILS"
}
