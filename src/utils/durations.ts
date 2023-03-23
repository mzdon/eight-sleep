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

export const getMomentIteratorFromDuration = (duration: Duration) => {
  return {
    [Symbol.iterator]() {
      let m = moment(duration[0]);
      const end = moment(duration[1]);
      return {
        next: () => {
          if (m.isBefore(end)) {
            const result = {value: m, done: false};
            m = m.clone().add(1, 'day');
            return result;
          }
          return {value: m, done: true};
        },
      };
    },
  };
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
  minDate?: string,
  maxDate?: string,
) => {
  const startOfDuration = mapDurationTypeToStartOfDuration(durationType);
  // always use the higher duration bound so we end up with the most recent date
  // from the previous duration as we reduce duration length (i.e. last day of
  // the week we were just using)
  const newDuration = getDuration(lastDuration[1], startOfDuration);
  if (minDate) {
    // if the new upper duration bound is before the min date return a duration based on the min date
    const min = moment(minDate);
    if (moment(newDuration[1]).isBefore(min)) {
      return getDuration(minDate, startOfDuration);
    }
  }
  if (maxDate) {
    // if the new lower duration bound is after the max date return a duration based on the max date
    const max = moment(maxDate);
    if (moment(newDuration[0]).isAfter(max)) {
      return getDuration(maxDate, startOfDuration);
    }
  }
  return newDuration;
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
