import {AxiosResponse} from 'axios';
import {Client, HttpError} from '../shared';
import {isAxiosError} from '../predicates';
import {SleepDataClientErrors, SleepDataInternalServerError} from './errors';
import {UserSleepDataResponse} from './types';

class SleepDataClient extends Client {
  public async fetchUserData(userUuid: string): Promise<UserSleepDataResponse> {
    return this.sendRequest(async () =>
      this.get<UserSleepDataResponse>(`/${userUuid}.json`),
    );
  }

  private async sendRequest<T = unknown>(
    req: () => Promise<AxiosResponse<T>>,
  ): Promise<T> {
    try {
      const resp = await req();
      return resp.data;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  private handleError(error: unknown): Error {
    if (isAxiosError(error)) {
      if (SleepDataClientErrors.has(error.response.status)) {
        const SleepDataError = SleepDataClientErrors.get(error.response.status);
        // Could enhance by passing error to Error constructor to parse
        // server error response details
        return new SleepDataError();
      }
      return new HttpError(error.message, error.response.status);
    }
    // We don't really know what happened
    return new SleepDataInternalServerError();
  }
}

export default SleepDataClient;
