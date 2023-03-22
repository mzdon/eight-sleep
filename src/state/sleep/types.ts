import {SleepInterval} from '../../api';

export interface UserSleepData {
  intervals: SleepInterval[];
  minDate: string | null; // ISO-8601
  maxDate: string | null; // ISO-8601
  lastFetch: string; // ISO-8601
}

export interface SleepLibState {
  requestError: Error | null;
  userSleepData: {
    [uuid: string]: UserSleepData;
  };
  isFetching: boolean;
  _fetchPromise: Promise<void> | null;
}

export enum SleepLibActions {
  FETCH_USER_SLEEP_DATA_START = 'FETCH_USER_SLEEP_DATA_START',
  FETCH_USER_SLEEP_DATA_SUCCESS = 'FETCH_USER_SLEEP_DATA_SUCCESS',
  FETCH_USER_SLEEP_DATA_FAILURE = 'FETCH_USER_SLEEP_DATA_FAILURE',
  FETCH_USER_SLEEP_DATA_COMPLETE = 'FETCH_USER_SLEEP_DATA_COMPLETE',
}
