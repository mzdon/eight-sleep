import {AxiosErrorWithResponse} from './types';

export const isAxiosError = (
  error: unknown,
): error is AxiosErrorWithResponse => {
  return !!(error as AxiosErrorWithResponse)?.response;
};
