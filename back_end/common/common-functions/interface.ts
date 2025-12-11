import { HttpStatusCode } from "./enum";

export interface SearchParams {
  limit?: number;
  order?: string[][];
  offset?: number;
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
