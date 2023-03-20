import {AxiosError, AxiosResponse} from 'axios';

export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// only handle AxiosError with a response as an AxiosError
// others will be unknown HttpErrors
export type AxiosErrorWithResponse = AxiosError & {
  response: AxiosResponse;
};
