import {SleepInterval} from '../../api';
import {ONE_HOUR_MS} from './constants';
import {SleepLibState} from './types';

export const shouldFetchUserSleepData = (
  state: SleepLibState,
  uuid: string,
): boolean => {
  const userSleepData = state.userSleepData[uuid];
  if (!userSleepData) {
    return true;
  }
  const {lastFetch} = userSleepData;
  const lastFetchMs = new Date(lastFetch).getTime();
  return new Date().getTime() - lastFetchMs > ONE_HOUR_MS;
};

export const getMinDate = (intervals: SleepInterval[]): string | null => {
  return intervals.length ? intervals[intervals.length - 1].ts : null;
};

export const getMaxDate = (intervals: SleepInterval[]): string | null => {
  return intervals.length ? intervals[0].ts : null;
};

export const getNowAsISO8601 = () => new Date().toISOString();
