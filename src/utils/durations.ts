import moment from 'moment';
import {UserSleepData} from '../state/sleep';

export type Duration = [string, string];

export enum DurationType {
  DAY = 'DAY',
  WEEK = 'WEEK',
}

export const getDuration = (
  ts: string | undefined,
  startOfDuration: moment.unitOfTime.StartOf,
): Duration => {
  return [
    moment(ts).startOf(startOfDuration).toISOString(),
    moment(ts).endOf(startOfDuration).toISOString(),
  ];
};

export const getMostRecentDuration = (
  sleepData: UserSleepData | null,
  startOfDuration: moment.unitOfTime.StartOf,
): Duration => {
  const ts = sleepData?.intervals[0]?.ts ?? undefined;
  return getDuration(ts, startOfDuration);
};

export const getMostRecentDayDuration = (
  sleepData: UserSleepData | null,
): Duration => getMostRecentDuration(sleepData, 'day');

export const getMostRecentWeekDuration = (
  sleepData: UserSleepData | null,
): Duration => getMostRecentDuration(sleepData, 'week');

export const getDefaultDuration = (
  sleepData: UserSleepData | null,
  durationType: DurationType,
): Duration => {
  switch (durationType) {
    case DurationType.DAY:
      return getMostRecentDayDuration(sleepData);
    case DurationType.WEEK:
      return getMostRecentWeekDuration(sleepData);
    default:
      throw new Error(`Unknown duration type: ${durationType}`);
  }
};

export const mapDurationTypeToStartOfDuration = (
  durationType: DurationType,
): moment.unitOfTime.StartOf => {
  switch (durationType) {
    case DurationType.DAY:
      return 'day';
    case DurationType.WEEK:
      return 'week';
    default:
      throw new Error(`Unrecognized DurationType: ${durationType}`);
  }
};

export const getDurationForNextDurationType = (
  lastDuration: Duration,
  durationType: DurationType,
) => {
  const startOfDuration = mapDurationTypeToStartOfDuration(durationType);
  // always use the higher duration bound so we end up with the most recent date
  // from the previous duration as we reduce duration length (i.e. last day of
  // the week we were just using)
  // TODO: pass the userSleepData as well so we can verify data exists on the newly
  // selected duration and adjust if necessary
  return getDuration(lastDuration[1], startOfDuration);
};

export const getNextDuration = (
  duration: Duration,
  durationType: DurationType,
): Duration => {
  const nextDay = moment(duration[1]).add(1, 'day').toISOString();
  return getDuration(nextDay, mapDurationTypeToStartOfDuration(durationType));
};

export const getPreviousDuration = (
  duration: Duration,
  durationType: DurationType,
): Duration => {
  const previous = moment(duration[0]).subtract(1, 'day').toISOString();
  return getDuration(previous, mapDurationTypeToStartOfDuration(durationType));
};
