import moment from 'moment';
import {SleepInterval} from '../api';
import {UserSleepData} from '../state/sleep';
import {Duration} from './durations';

export const getIntervalsFromDataByDuration = (
  sleepData: UserSleepData | null,
  duration: Duration,
): SleepInterval[] => {
  if (!sleepData?.intervals.length) {
    return [];
  }
  const lowerBound = moment(duration[0]);
  const upperBound = moment(duration[1]);
  return sleepData.intervals.filter(({ts}) =>
    moment(ts).isBetween(lowerBound, upperBound, undefined, '[]'),
  );
};

export const getIntervalDataPointsWithinDuration = <
  K extends keyof SleepInterval,
>(
  sleepData: UserSleepData | null,
  duration: Duration,
  intervalKey: K,
): [string, SleepInterval[K]][] => {
  const intervals = getIntervalsFromDataByDuration(sleepData, duration);
  return intervals.map(interval => [interval.ts, interval[intervalKey]]);
};
